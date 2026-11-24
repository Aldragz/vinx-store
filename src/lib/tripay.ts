import crypto from 'crypto';

export interface TripayPaymentChannel {
  code: string;
  name: string;
  group: 'QRIS' | 'E-Wallet' | 'Virtual Account' | 'Convenience Store';
  feeFlat: number;
  feePercent: number;
  icon: string;
}

export const PAYMENT_CHANNELS: TripayPaymentChannel[] = [
  {
    code: 'QRIS',
    name: 'QRIS Instant (Semua Bank & E-Wallet)',
    group: 'QRIS',
    feeFlat: 0,
    feePercent: 0.7,
    icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80',
  },
  {
    code: 'DANA',
    name: 'DANA E-Wallet',
    group: 'E-Wallet',
    feeFlat: 1000,
    feePercent: 1.5,
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&q=80',
  },
  {
    code: 'OVO',
    name: 'OVO E-Wallet',
    group: 'E-Wallet',
    feeFlat: 1000,
    feePercent: 1.5,
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&q=80',
  },
  {
    code: 'SHOPEEPAY',
    name: 'ShopeePay',
    group: 'E-Wallet',
    feeFlat: 1000,
    feePercent: 1.5,
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&q=80',
  },
  {
    code: 'BCAVA',
    name: 'BCA Virtual Account',
    group: 'Virtual Account',
    feeFlat: 3500,
    feePercent: 0,
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&q=80',
  },
  {
    code: 'MANDIRIVA',
    name: 'Mandiri Virtual Account',
    group: 'Virtual Account',
    feeFlat: 3500,
    feePercent: 0,
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&q=80',
  },
  {
    code: 'BRIVA',
    name: 'BRI Virtual Account',
    group: 'Virtual Account',
    feeFlat: 3000,
    feePercent: 0,
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&q=80',
  },
];

export class TripayClient {
  private apiKey: string;
  private privateKey: string;
  private merchantCode: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.TRIPAY_API_KEY || '';
    this.privateKey = process.env.TRIPAY_PRIVATE_KEY || '';
    this.merchantCode = process.env.TRIPAY_MERCHANT_CODE || '';
    const mode = process.env.TRIPAY_MODE || 'sandbox';
    this.baseUrl =
      mode === 'production'
        ? 'https://tripay.co.id/api'
        : 'https://tripay.co.id/api-sandbox';
  }

  calculateFee(channelCode: string, amount: number): { fee: number; total: number } {
    const channel = PAYMENT_CHANNELS.find((c) => c.code === channelCode) || PAYMENT_CHANNELS[0];
    const percentFee = Math.round((amount * channel.feePercent) / 100);
    const fee = channel.feeFlat + percentFee;
    return { fee, total: amount + fee };
  }

  async createTransaction(params: {
    method: string;
    merchantRef: string;
    amount: number;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    orderItems: { name: string; price: number; quantity: number }[];
  }): Promise<{
    success: boolean;
    reference: string;
    payCode?: string;
    qrUrl?: string;
    checkoutUrl?: string;
    expiredAt?: Date;
    message?: string;
  }> {
    // Mode simulasi jika API key placeholder / dev
    if (!this.apiKey || this.apiKey.includes('dev-') || this.apiKey.includes('your_')) {
      const isQris = params.method === 'QRIS';
      return {
        success: true,
        reference: `DEV-TRP-${Date.now()}`,
        payCode: isQris ? undefined : `8808${Math.floor(10000000 + Math.random() * 90000000)}`,
        qrUrl: isQris
          ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226680016ID.CO.TRIPAY.WWW01189360099900000100000215${params.merchantRef}520458125303360540${params.amount}5802ID5910VINX_STORE6007JAKARTA`
          : undefined,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    }

    try {
      const signature = crypto
        .createHmac('sha256', this.privateKey)
        .update(this.merchantCode + params.merchantRef + params.amount)
        .digest('hex');

      const response = await fetch(`${this.baseUrl}/transaction/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: params.method,
          merchant_ref: params.merchantRef,
          amount: params.amount,
          customer_name: params.customerName,
          customer_email: params.customerEmail || `${params.customerPhone}@vinxstore.com`,
          customer_phone: params.customerPhone,
          order_items: params.orderItems,
          signature,
          expiry: Math.floor(Date.now() / 1000) + 24 * 3600, // 24 jam
        }),
      });

      const res = await response.json();
      if (!res.success) {
        return { success: false, reference: '', message: res.message || 'Gagal membuat transaksi Tripay' };
      }

      const data = res.data;
      return {
        success: true,
        reference: data.reference,
        payCode: data.pay_code,
        qrUrl: data.qr_url,
        checkoutUrl: data.checkout_url,
        expiredAt: new Date(data.expired_time * 1000),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, reference: '', message: msg };
    }
  }

  verifyCallback(jsonBody: string, signatureHeader: string): boolean {
    if (!this.privateKey || this.privateKey.includes('dev-')) return true;
    const computed = crypto
      .createHmac('sha256', this.privateKey)
      .update(jsonBody)
      .digest('hex');
    return computed === signatureHeader;
  }
}

export const tripay = new TripayClient();
