import crypto from 'crypto';

export interface DigiflazzBalanceResponse {
  deposit: number;
}

export interface DigiflazzPriceItem {
  product_name: string;
  category: string;
  brand: string;
  type: string;
  seller_name: string;
  price: number;
  buyer_sku_code: string;
  buyer_product_status: boolean;
  seller_product_status: boolean;
  unlimited_stock: boolean;
  stock: number;
  multi: boolean;
  start_cut_off: string;
  end_cut_off: string;
  desc: string;
}

export interface DigiflazzTransactionResponse {
  data: {
    ref_id: string;
    customer_no: string;
    buyer_sku_code: string;
    message: string;
    status: 'Sukses' | 'Pending' | 'Gagal';
    rc: string;
    sn: string;
    price: number;
    tele?: string;
    wa?: string;
  };
}

export class DigiflazzClient {
  private username: string;
  private apiKey: string;
  private isTesting: boolean;
  private baseUrl = 'https://api.digiflazz.com/v1';

  constructor(username?: string, apiKey?: string, mode?: string) {
    this.username = username || process.env.DIGIFLAZZ_USERNAME || '';
    this.apiKey = apiKey || process.env.DIGIFLAZZ_API_KEY || '';
    this.isTesting = (mode || process.env.DIGIFLAZZ_MODE || 'development') === 'development';
  }

  private generateSign(keyPart: string): string {
    return crypto
      .createHash('md5')
      .update(this.username + this.apiKey + keyPart)
      .digest('hex');
  }

  // Cek Saldo Digiflazz
  async checkBalance(): Promise<{ success: boolean; balance?: number; message?: string }> {
    // Fallback simulation if placeholder or dev
    if (!this.username || !this.apiKey || this.apiKey.includes('dev-') || this.apiKey.includes('your_')) {
      return {
        success: true,
        balance: 1450000,
        message: 'Mode Simulasi (Development)',
      };
    }

    try {
      const sign = this.generateSign('depo');
      const response = await fetch(`${this.baseUrl}/cek-saldo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cmd: 'deposit',
          username: this.username,
          sign,
        }),
      });

      const json = await response.json();
      if (json?.data?.deposit !== undefined) {
        return { success: true, balance: json.data.deposit };
      }
      return { success: false, message: json?.data?.message || 'Gagal mengambil saldo' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: msg };
    }
  }

  // Ambil Price List produk dari Digiflazz
  async getPriceList(): Promise<{ success: boolean; data?: DigiflazzPriceItem[]; message?: string }> {
    if (!this.username || !this.apiKey || this.apiKey.includes('dev-')) {
      return { success: true, data: [], message: 'Mode Simulasi Digiflazz' };
    }

    try {
      const sign = this.generateSign('pricelist');
      const response = await fetch(`${this.baseUrl}/price-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cmd: 'prepaid',
          username: this.username,
          sign,
        }),
      });

      const json = await response.json();
      if (Array.isArray(json?.data)) {
        return { success: true, data: json.data };
      }
      return { success: false, message: 'Format data tidak sesuai' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: msg };
    }
  }

  // Eksekusi transaksi topup ke Digiflazz
  async orderTopup(params: {
    buyerSkuCode: string;
    customerNo: string;
    refId: string;
  }): Promise<{
    success: boolean;
    status: 'Sukses' | 'Pending' | 'Gagal';
    sn?: string;
    message: string;
    price?: number;
  }> {
    // Mode simulasi otomatis jika kredensial dummy
    if (!this.username || !this.apiKey || this.apiKey.includes('dev-') || this.isTesting) {
      const simulatedSn = `VINX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        status: 'Sukses',
        sn: simulatedSn,
        message: 'Transaksi Berhasil (Simulasi Digiflazz)',
        price: 0,
      };
    }

    try {
      const sign = this.generateSign(params.refId);
      const response = await fetch(`${this.baseUrl}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          buyer_sku_code: params.buyerSkuCode,
          customer_no: params.customerNo,
          ref_id: params.refId,
          sign,
          testing: this.isTesting,
        }),
      });

      const json = await response.json();
      const resData = json?.data;

      if (!resData) {
        return {
          success: false,
          status: 'Gagal',
          message: json?.message || 'Respon kosong dari provider',
        };
      }

      return {
        success: resData.status === 'Sukses',
        status: resData.status,
        sn: resData.sn || '',
        message: resData.message || '',
        price: resData.price,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        status: 'Pending',
        message: `Koneksi timeout: ${msg}`,
      };
    }
  }
}

export const digiflazz = new DigiflazzClient();
