"""
=============================================================================
SKRIP PENGIRIMAN EMAIL UNDANGAN DEMONSTRASI UTS KJK MENGGUNAKAN PYTHON
=============================================================================
Skrip ini mengirimkan email undangan demonstrasi interaktif ke teman
menggunakan server SMTP Gmail dengan format HTML responsif & Plain Text.

CARA MENDAPATKAN APP PASSWORD GMAIL:
1. Akun Gmail pengirim wajib mengaktifkan Verifikasi 2 Langkah (2-Step Verification).
2. Buka tautan: https://myaccount.google.com/apppasswords
3. Buat Sandi Aplikasi (App Password) baru:
   - Nama aplikasi: "Demo KJK"
   - Klik "Create" / "Buat"
4. Google akan menampilkan 16 karakter kode (contoh: "abcd efgh ijkl mnop").
5. Masukkan kode tersebut ke skrip ini.
"""

import smtplib
import ssl
import getpass
import os
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# =============================================================================
# KONFIGURASI DEFAULT (Bisa langsung diisi di sini atau lewat input interaktif)
# =============================================================================

# 1. Email Gmail Anda sebagai pengirim
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")

# 2. 16 Karakter App Password (Sandi Aplikasi) dari akun Google Anda
APP_PASSWORD = os.getenv("APP_PASSWORD", "")

# 3. Tautan website demo Anda di Vercel
DEMO_URL = os.getenv("DEMO_URL", "https://ocha-adelia-kjk.vercel.app")

# 4. Nama Pengirim
SENDER_NAME = "Ocha Adelia"

# 5. Daftar email penerima default (jika ingin disimpan di skrip)
DEFAULT_RECIPIENTS = [
    # "teman1@gmail.com",
    # "teman2@gmail.com",
]

SUBJECT = "[UTS KJK] Undangan Partisipasi Demonstrasi Interaktif Keamanan Sistem"


def create_email_body(sender_name: str, demo_url: str):
    """
    Membuat konten email dalam format Teks Biasa dan HTML Responsif.
    """
    plain_text = f"""Halo teman-teman,

Perkenalkan, saya {sender_name}. Saat ini saya sedang mengerjakan tugas proyek Ujian Tengah Semester (UTS) untuk mata kuliah Keamanan Jaringan dan Komputer (KJK).

Saya mengundang Anda untuk mencoba website demonstrasi interaktif sederhana yang telah saya buat dan deploy ke Vercel:

Tautan Website: {demo_url}

PANDUAN INTERAKSI:
1. Buka tautan di atas melalui browser (HP atau Laptop).
2. Masukkan nama demo dan kata sandi simulasi pada form login.
3. Klik tombol "Kirim Interaksi Demonstrasi".
4. Anda akan diarahkan ke halaman konfirmasi bahwa interaksi telah berhasil dicatat.

CATATAN PRIVASI & KEAMANAN:
Website ini dibuat murni untuk simulasi edukatif. Sesuai prinsip keamanan etis, sistem ini SAMA SEKALI TIDAK menyimpan atau mengirimkan kata sandi Anda. Data yang dicatat hanya berupa ID sesi acak dan waktu tombol ditekan.

Terima kasih banyak atas bantuan dan partisipasi teman-teman!

Salam hangat,
{sender_name}
Mahasiswa Keamanan Jaringan & Komputer
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Undangan Demonstrasi KJK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b1120; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Kartu Email -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 28px 30px; background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                Portal Demonstrasi Interaktif KJK
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #e0f2fe;">
                Proyek Ujian Tengah Semester &bull; Keamanan Jaringan & Komputer
              </p>
            </td>
          </tr>

          <!-- Konten -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Halo teman-teman,
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Perkenalkan, saya <strong style="color: #38bdf8;">{sender_name}</strong>. Saat ini saya sedang mengerjakan proyek UTS mata kuliah <strong>Keamanan Jaringan & Komputer (KJK)</strong> untuk mendemonstrasikan alur interaksi pengguna dan pencatatan telemetri sesi ke Google Sheets.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Saya mengundang Anda untuk mencoba demonstrasi interaktif ini melalui tautan di bawah:
              </p>

              <!-- Tombol CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="{demo_url}" target="_blank" style="display: inline-block; padding: 14px 28px; background: linear-gradient(90deg, #06b6d4, #3b82f6); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 10px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);">
                      Buka Website Demonstrasi &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Kotak Jaminan Privasi -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #020617; border: 1px solid #1e293b; border-radius: 12px; margin: 24px 0; padding: 14px 18px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #38bdf8;">
                      &#128737; Catatan Privasi & Keamanan:
                    </p>
                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                      Website ini dirancang mematuhi etika keamanan. Sistem <strong>TIDAK PERNAH menyimpan atau mengirimkan kata sandi</strong>. Hanya ID sesi acak dan waktu klik yang dicatat untuk kebutuhan analisis UTS.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Terima kasih banyak atas waktu dan bantuan teman-teman dalam menyukseskan demonstrasi ini!
              </p>
              <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Salam hangat,<br>
                <strong style="color: #ffffff;">{sender_name}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 30px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Tautan alternatif: <a href="{demo_url}" style="color: #38bdf8; text-decoration: none;">{demo_url}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    return plain_text, html_content


def main():
    print("=" * 65)
    print("  PENGIRIM EMAIL UNDANGAN DEMONSTRASI UTS KJK (PYTHON)")
    print("=" * 65)

    sender = SENDER_EMAIL
    if not sender:
        sender = input("Masukkan Email Gmail Pengirim: ").strip()

    app_pass = APP_PASSWORD
    if not app_pass:
        print("\nCatatan: Masukkan 16 karakter App Password dari Google")
        print("Tautan panduan: https://myaccount.google.com/apppasswords")
        app_pass = getpass.getpass("Masukkan Google App Password: ").strip()

    demo_link = DEMO_URL
    if not demo_link:
        demo_link = input("Masukkan Tautan Vercel Website: ").strip()

    recipients = [r for r in DEFAULT_RECIPIENTS if r.strip()]
    if not recipients:
        print("\nMasukkan daftar email teman penerima (pisahkan dengan koma jika lebih dari satu):")
        inp = input("Email Penerima: ").strip()
        recipients = [item.strip() for item in inp.split(",") if item.strip()]

    if not recipients:
        print("[!] Tidak ada email penerima yang dimasukkan. Pengiriman dibatalkan.")
        sys.exit(0)

    clean_pass = app_pass.replace(" ", "")
    plain_body, html_body = create_email_body(SENDER_NAME, demo_link)

    smtp_host = "smtp.gmail.com"
    smtp_port = 465
    context = ssl.create_default_context()

    print(f"\n[*] Menghubungkan ke SMTP Gmail ({smtp_host}:{smtp_port})...")

    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
            print("[*] Melakukan login...")
            server.login(sender, clean_pass)
            print("[+] Autentikasi berhasil!\n")

            total = len(recipients)
            success_count = 0

            for index, recipient in enumerate(recipients, start=1):
                print(f"[{index}/{total}] Mengirim ke {recipient} ...", end=" ", flush=True)

                msg = MIMEMultipart("alternative")
                msg["Subject"] = SUBJECT
                msg["From"] = f"{SENDER_NAME} <{sender}>"
                msg["To"] = recipient

                msg.attach(MIMEText(plain_body, "plain", "utf-8"))
                msg.attach(MIMEText(html_body, "html", "utf-8"))

                try:
                    server.sendmail(sender, recipient, msg.as_string())
                    print("BERHASIL [v]")
                    success_count += 1
                except Exception as err:
                    print(f"GAGAL [x] -> {err}")

            print("\n" + "=" * 65)
            print(f"[+] SELESAI: {success_count} dari {total} email berhasil dikirimkan.")
            print("=" * 65)

    except smtplib.SMTPAuthenticationError:
        print("\n[x] GAGAL AUTENTIKASI GMAIL:")
        print("    1. Pastikan 'Verifikasi 2 Langkah' aktif pada akun Google Anda.")
        print("    2. Gunakan 16 karakter 'Sandi Aplikasi' (App Password), BUKAN sandi akun Google biasa.")
        print("    3. Buat di: https://myaccount.google.com/apppasswords")
    except Exception as e:
        print(f"\n[x] Terjadi kesalahan: {e}")


if __name__ == "__main__":
    main()
