/**
 * Modul Pencatatan Interaksi Telemetri (Privacy-Safe)
 * 
 * Modul ini HANYA mencatat metadata interaksi:
 * 1. ID sesi acak
 * 2. Waktu interaksi (timestamp)
 * 3. Jenis interaksi (misal: "button_clicked")
 * 4. Status interaksi (misal: "success")
 * 
 * PERINGATAN KEAMANAN:
 * Modul ini TIDAK PERNAH menerima, memproses, menyimpan, atau mengirimkan
 * kata sandi, OTP, token, atau informasi autentikasi rahasia apapun.
 */

export interface InteractionPayload {
  sessionId: string;
  timestamp: string;
  interactionType: string;
  status: 'success' | 'failed' | 'attempted';
  userAgent?: string;
}

export interface TrackingResult {
  success: boolean;
  sessionId: string;
  timestamp: string;
  message?: string;
}

/**
 * Menghasilkan ID sesi acak yang unik untuk keperluan demonstrasi
 * Format contoh: SES-A8F2-9C1D
 */
export function generateSessionId(): string {
  const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SES-${segment1}-${segment2}`;
}

/**
 * Mendapatkan ID sesi saat ini dari sessionStorage atau membuat yang baru jika belum ada
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionId();
  }

  const storageKey = 'kjk_demo_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

/**
 * Format timestamp ke format zona waktu Indonesia (WIB)
 */
export function getFormattedTimestamp(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

// In-memory set untuk mencegah pencatatan ganda dalam runtime yang sama
const recordedSessions = new Set<string>();

/**
 * Mengirimkan data interaksi demonstrasi ke Google Sheets via endpoint API
 * Menggunakan mekanisme timeout agar tidak memblokir navigasi pengguna jika terjadi kendala jaringan.
 */
export async function trackInteraction(params: {
  interactionType?: string;
  status?: 'success' | 'failed' | 'attempted';
  customSessionId?: string;
}): Promise<TrackingResult> {
  const sessionId = params.customSessionId || getOrCreateSessionId();
  const timestamp = getFormattedTimestamp();
  const interactionType = params.interactionType || 'tombol_login_demo_ditekan';
  const status = params.status || 'success';

  // 1. Cek Deduplikasi: Hindari pencatatan berulang untuk interaksi pada sesi yang sama
  const deduplicationKey = `tracked_${sessionId}_${interactionType}`;
  if (typeof window !== 'undefined') {
    if (sessionStorage.getItem(deduplicationKey) || recordedSessions.has(deduplicationKey)) {
      return {
        success: true,
        sessionId,
        timestamp,
        message: 'Interaksi sudah tercatat sebelumnya (deduplicated).',
      };
    }
    // Tandai agar tidak dikirim ulang
    sessionStorage.setItem(deduplicationKey, 'true');
    recordedSessions.add(deduplicationKey);
  }

  // 2. Siapkan data telemetri yang AMAN (TIDAK ADA PASSWORD / KREDENSIAL)
  const payload: InteractionPayload = {
    sessionId,
    timestamp,
    interactionType,
    status,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
  };

  // 3. Kirim data ke API internal Next.js (/api/track) dengan timeout pengaman
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 detik timeout pengaman

    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn('[Tracking] Response server tidak OK:', response.status);
      return {
        success: false,
        sessionId,
        timestamp,
        message: `Status respons: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      sessionId,
      timestamp,
      message: data.message || 'Interaksi berhasil dicatat.',
    };
  } catch (error: unknown) {
    // Tangani kegagalan tanpa menghentikan atau mengganggu pengguna
    console.warn('[Tracking] Pencatatan telemetri offline atau timeout (non-blocking):', error);
    return {
      success: false,
      sessionId,
      timestamp,
      message: 'Gagal menghubungi server pencatatan, namun alur pengguna tetap dilanjutkan.',
    };
  }
}
