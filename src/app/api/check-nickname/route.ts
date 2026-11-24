import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { gameSlug, userId, zoneId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID wajib diisi' }, { status: 400 });
    }

    // Realistic nickname simulation for popular games
    // Format: Nickname verification
    const dummyNicknames: Record<string, string[]> = {
      'mobile-legends': ['Vinx・SkyLord', 'Aero・Mythic', 'Royal_Sniper', 'NightRaven', 'Azure_King'],
      'free-fire': ['VINX_BOOYAH', 'HeadshotPro', 'SkyBlue_Gamer', 'Elite_Ghost'],
      'pubg-mobile': ['VinxWinner', 'AirdropKing', 'FalconEye_PUBG', 'SkyMarshal'],
      'genshin-impact': ['Traveler_Vinx', 'Archon_Azure', 'Keqing_Simp', 'Celestia_Hero'],
      'honor-of-kings': ['Vinx_Grandmaster', 'AzureBlade', 'HoK_Dynasty'],
    };

    const names = dummyNicknames[gameSlug] || ['Vinx_Verified_Player', 'Sky_Gamer'];
    const hash = (userId + (zoneId || '')).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const chosenName = names[hash % names.length];

    return NextResponse.json({
      success: true,
      nickname: chosenName,
      userId,
      zoneId: zoneId || null,
      message: 'Akun terverifikasi',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
