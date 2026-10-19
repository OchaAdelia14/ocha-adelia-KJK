/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: PENCATATAN INTERAKSI KE GOOGLE SHEETS
 * PROYEK UTS KEAMANAN JARINGAN & KOMPUTER (KJK)
 * =========================================================================
 * 
 * PANDUAN DEPLOYMENT:
 * 1. Buka Google Sheets baru di https://sheets.new
 * 2. Beri nama file Google Sheets, misalnya: "Log Interaksi Demo KJK"
 * 3. Klik menu "Extensions" (Ekstensi) > "Apps Script"
 * 4. Hapus kode default, lalu salin dan tempel SELURUH KODE di bawah ini.
 * 5. Klik ikon Simpan (Save).
 * 6. Klik tombol "Deploy" (Terapkan) berwarna biru di kanan atas > "New deployment" (Penerapan baru).
 * 7. Pada ikon roda gigi "Select type", pilih "Web app".
 * 8. Isi konfigurasi:
 *    - Description: "Endpoint Pencatatan Interaksi KJK"
 *    - Execute as: "Me" (akun Google Anda)
 *    - Who has access: "Anyone" (Siapa saja - PENTING agar dapat diakses dari Vercel/Web)
 * 9. Klik "Deploy", lalu berikan izin akses (Authorize access) dengan akun Google Anda.
 * 10. Salin "Web app URL" (berakhiran /exec) dan simpan ke environment variable GOOGLE_SCRIPT_URL.
 */

// Nama sheet yang digunakan untuk mencatat data
const SHEET_NAME = 'Log_Interaksi';

/**
 * Menangani HTTP POST Request dari aplikasi Next.js
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  // Tunggu maksimal 10 detik untuk menghindari race condition saat multi-request
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Server sedang sibuk, coba beberapa saat lagi.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Buat sheet dan header otomatis jika belum ada
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      initHeaders(sheet);
    } else if (sheet.getLastRow() === 0) {
      initHeaders(sheet);
    }

    // Ambil data JSON dari body request
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = {};
      }
    }

    // Data telemetri yang dicatat (HANYA METADATA - TIDAK ADA KREDENSIAL/PASSWORD)
    const timestamp = payload.timestamp || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
    const sessionId = payload.sessionId || 'UNKNOWN_SESSION';
    const interactionType = payload.interactionType || 'button_clicked';
    const status = payload.status || 'success';
    const userAgent = payload.userAgent || 'Unknown Browser';

    // Nomor urut baris
    const rowNumber = Math.max(1, sheet.getLastRow());

    // Tambahkan baris baru
    sheet.appendRow([
      rowNumber,
      timestamp,
      sessionId,
      interactionType,
      status,
      userAgent
    ]);

    // Berikan respons sukses dalam format JSON
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Interaksi berhasil dicatat ke Google Sheets.',
      recorded: {
        row: rowNumber,
        sessionId: sessionId,
        timestamp: timestamp
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Menangani HTTP GET Request untuk keperluan uji coba endpoint status
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    service: 'KJK Demo Interaction Logger Web App',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi pembantu untuk membuat header kolom jika sheet masih kosong
 */
function initHeaders(sheet) {
  const headers = [
    'No',
    'Waktu Interaksi (WIB)',
    'ID Sesi (Random)',
    'Jenis Interaksi',
    'Status Interaksi',
    'Perangkat / User Agent'
  ];

  sheet.appendRow(headers);

  // Styling baris header: background navy, teks putih tebal
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1E293B');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Atur lebar kolom agar rapi
  sheet.setColumnWidth(1, 60);   // No
  sheet.setColumnWidth(2, 220);  // Waktu
  sheet.setColumnWidth(3, 160);  // ID Sesi
  sheet.setColumnWidth(4, 200);  // Jenis Interaksi
  sheet.setColumnWidth(5, 130);  // Status
  sheet.setColumnWidth(6, 300);  // User Agent
  
  sheet.setFrozenRows(1);
}
