import nodemailer from "nodemailer";
import type { NextRequest } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const SMTP_HOST = process.env.NEXT_PUBLIC_SMTP_HOST;
const SMTP_PORT = process.env.NEXT_PUBLIC_SMTP_PORT;
const SMTP_SECURE = process.env.NEXT_PUBLIC_SMTP_SECURE === "true" || true;
const SMTP_USER = process.env.NEXT_PUBLIC_SMTP_USER;
const SMTP_PASS = process.env.NEXT_PUBLIC_SMTP_PASS;
const SMTP_FROM = process.env.NEXT_PUBLIC_SMTP_FROM || "Quote Request <videoanalyticspro@gmail.com>";

function escapeHtml(input: string | undefined | null) {
  if (!input) return '-';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let cachedTransport: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransport) return cachedTransport;
  if (!SMTP_HOST) {
    console.error('SMTP_HOST not configured, email disabled');
    return null;
  }
  const t = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  } as nodemailer.TransportOptions);
  t.verify()
    .then(() => console.log('SMTP transporter verified'))
    .catch((err) => console.error('SMTP transporter verification failed', err));
  cachedTransport = t;
  return cachedTransport;
}

export async function POST(req: NextRequest) {
  if (!ADMIN_EMAIL) {
    return new Response("Server not configured", { status: 500 });
  }
  try {
    const data = await req.json();

    const {
      name,
      email,
      phone,
      company,
      message,
      productDetails, 
    } = data;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return new Response('Invalid email', { status: 400 });
    }
    if (!name) {
      return new Response('Name is required', { status: 400 });
    }
    if (!productDetails || !Array.isArray(productDetails) || productDetails.length === 0) {
      return new Response('Product Details are required', { status: 400 });
    }

    const transporter = getTransporter();
    if (!transporter) {
      console.error('Attempt to send email but SMTP not configured');
      return new Response(JSON.stringify({
        ok: false,
        message: 'Email service is not configured. Please contact support.'
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      await transporter.verify();
    } catch (err) {
      console.error('SMTP verify failed at send time', err);
      return new Response(JSON.stringify({ ok:false, message:'Email server unreachable' }), { status:500, headers:{ 'Content-Type':'application/json' } });
    }


    // Render sender details and all products in the productDetails array as tables
    let senderDetailsHtml = `<h3 style="color:#2563eb;margin-top:24px;">Sender Details</h3><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:8px;margin-bottom:18px;border-collapse:collapse;">`;
    senderDetailsHtml += `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;width:120px;">Name</td><td style="padding:6px 0;">${escapeHtml(name)}</td></tr>`;
    senderDetailsHtml += `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;width:120px;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email)}</a></td></tr>`;
    senderDetailsHtml += `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;width:120px;">Phone</td><td style="padding:6px 0;">${escapeHtml(phone)}</td></tr>`;
    if (company) senderDetailsHtml += `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;width:120px;">Company</td><td style="padding:6px 0;">${escapeHtml(company)}</td></tr>`;
    senderDetailsHtml += '</table>';

    let productDetailsHtml = '';
    if (Array.isArray(productDetails) && productDetails.length > 0) {
      productDetailsHtml = `<h3 style="color:#2563eb;margin-top:24px;">Product List</h3><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:8px;border-collapse:collapse;">`;
      productDetailsHtml += `<tr style="background:#f1f5f9;">
        <th align="left" style="padding:8px 6px;color:#222;font-size:14px;">Image</th>
        <th align="left" style="padding:8px 6px;color:#222;font-size:14px;">Name</th>
        <th align="left" style="padding:8px 6px;color:#222;font-size:14px;">Unit Price</th>
        <th align="left" style="padding:8px 6px;color:#222;font-size:14px;">Quantity</th>
        <th align="left" style="padding:8px 6px;color:#222;font-size:14px;">Subtotal</th>
      </tr>`;
      for (const prod of productDetails) {
        productDetailsHtml += `<tr>
          <td style="padding:6px 0;">
            ${prod.imageUrl || prod.image_url ? `<img src="${escapeHtml(prod.imageUrl || prod.image_url)}" alt="${escapeHtml(prod.name)}" style="height:40px;width:40px;object-fit:contain;border-radius:6px;border:1px solid #e5e7eb;background:#fff;" />` : ''}
          </td>
          <td style="padding:6px 0;font-weight:600;">${escapeHtml(prod.name)}</td>
          <td style="padding:6px 0;">$${typeof prod.price === 'number' ? Number(prod.price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '-'}</td>
          <td style="padding:6px 0;">${prod.quantity || 1}</td>
          <td style="padding:6px 0;font-weight:600;">$${typeof prod.price === 'number' ? (Number(prod.price) * (prod.quantity || 1)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '-'}</td>
        </tr>`;
      }
      productDetailsHtml += '</table>';
    }

    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Quote Request</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:24px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(16,24,40,0.08);">
            <tr>
            <td style="background:linear-gradient(90deg,#06b6d4,#3b82f6);padding:20px 24px;color:#fff;">
              <h1 style="margin:0;font-size:20px;font-weight:600;">New Quote Request</h1>
            </td>
            </tr>
            <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 12px 0;color:#555;">A new quote request was submitted. Details are below.</p>
              
              ${senderDetailsHtml}
              ${productDetailsHtml}
              <div style="margin-top:18px;">
              <div style="color:#6b7280;font-weight:600;margin-bottom:8px;">Message</div>
              <div style="padding:12px;border-radius:6px;background:#f8fafc;border:1px solid #eef2f7;color:#111;">${escapeHtml(message)}</div>
              </div>
              <p style="margin:20px 0 0 0;color:#6b7280;font-size:13px;">This email was generated automatically by your e-commerce platform.</p>
            </td>
            </tr>
            <tr>
            <td style="background:#f1f5f9;padding:12px 24px;text-align:center;color:#94a3b8;font-size:12px;">
              Video Analytics - Verve Automation
            </td>
            </tr>
          </table>
          </td>
        </tr>
        </table>
      </body>
      </html>`;


    // Set the 'from' field to the user's email and name
    const fromAddress = name && email ? `${escapeHtml(name)} <${escapeHtml(email)}>` : SMTP_FROM;

    await transporter.sendMail({
      from: fromAddress,
      replyTo: email ? String(email) : undefined,
      to: ADMIN_EMAIL,
      subject: `Quote Request from ${escapeHtml(name)} (${productDetails.length} product${productDetails.length > 1 ? 's' : ''})`,
      html,
    });

    console.log(`Quote request email sent to ${ADMIN_EMAIL} for ${productDetails.length} product(s)`);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("send email error", err);
    return new Response((err as Error)?.message || "Failed to send email", { status: 500 });
  }
}
