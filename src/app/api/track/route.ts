import { NextResponse } from 'next/server';

interface InteractionBody {
  sessionId?: string;
  timestamp?: string;
  interactionType?: string;
  status?: string;
  userAgent?: string;
}

export async function POST(request: Request) {
  try {
    const rawBody: InteractionBody = await request.json();

    // Sanitasi data: HANYA izinkan field telemetri yang valid.
    // Cegah penerusan data tak dikenal, kredensial, atau kata sandi.
    const safeData = {
      sessionId: String(rawBody.sessionId || 'UNKNOWN_SESSION').slice(0, 50),
      timestamp: String(rawBody.timestamp || new Date().toISOString()).slice(0, 100),
      interactionType: String(rawBody.interactionType || 'button_clicked').slice(0, 100),
      status: String(rawBody.status || 'success').slice(0, 50),
      userAgent: String(rawBody.userAgent || 'Unknown Agent').slice(0, 250),
    };

    // Ambil endpoint Google Apps Script dari Environment Variable
    const googleScriptUrl =
      process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    // Jika belum ada konfigurasi Google Apps Script URL (misal testing lokal awal)
    if (!googleScriptUrl) {
      console.info(
        '[Track API] GOOGLE_SCRIPT_URL belum disetel. Simulasi pencatatan lokal:',
        safeData
      );
      return NextResponse.json({
        success: true,
        mode: 'simulated_local',
        message: 'Dicatat dalam mode simulasi lokal (GOOGLE_SCRIPT_URL belum dikonfigurasi).',
        data: safeData,
      });
    }

    // Teruskan data ke Google Apps Script Web App dengan follow redirect
    const scriptResponse = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safeData),
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!scriptResponse.ok) {
      console.error(
        `[Track API] Gagal meneruskan ke Google Apps Script: HTTP ${scriptResponse.status}`
      );
      return NextResponse.json(
        {
          success: false,
          message: `Gagal mengirim ke Google Apps Script: ${scriptResponse.statusText}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Interaksi berhasil dicatat ke Google Sheets.',
      data: safeData,
    });
  } catch (error: unknown) {
    console.error('[Track API] Terjadi kesalahan pada endpoint pencatatan:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal saat memproses telemetri.',
      },
      { status: 500 }
    );
  }
}
