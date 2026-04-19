import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import getDb from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const db = getDb();
  const user = db.prepare('SELECT id, username FROM users WHERE email = ?').get(email) as
    { id: string; username: string } | undefined;

  // Always return success — don't reveal whether email exists
  if (!user) return NextResponse.json({ ok: true });

  // Generate token valid for 1 hour
  const token = randomBytes(32).toString('hex');
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;

  db.prepare('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)')
    .run(user.id, token, expiresAt);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  const result = await resend.emails.send({
    from: 'InkyIdentity <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your InkyIdentity password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 36px; background: #0f0f17; color: #f5f3ef; border-radius: 14px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px;">
          <span style="display: inline-block; width: 26px; height: 26px; border-radius: 7px; background: #d6354b; color: #f5f3ef; text-align: center; line-height: 26px; font-weight: 800;">I</span>
          <span style="color: #f5f3ef; font-size: 1.05rem; font-weight: 700; letter-spacing: -0.02em;">InkyIdentity</span>
        </div>
        <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0 0 12px; color: #f5f3ef; letter-spacing: -0.02em;">Reset your password</h1>
        <p style="color: #cfccc7; line-height: 1.6; margin: 0 0 28px;">
          Hi ${user.username}, click the button below to reset your password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #d6354b; color: #f5f3ef; text-decoration: none; padding: 13px 26px; border-radius: 10px; font-weight: 600; margin-bottom: 28px;">
          Reset password
        </a>
        <p style="color: #85838f; font-size: 0.82rem; line-height: 1.6;">
          If you didn't request this, you can ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });

  console.log('Resend result:', JSON.stringify(result));
  return NextResponse.json({ ok: true });
}
