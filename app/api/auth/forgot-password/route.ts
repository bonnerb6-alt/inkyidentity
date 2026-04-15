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
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #080808; color: #f9fafb; border-radius: 12px;">
        <div style="margin-bottom: 24px;">
          <span style="background: linear-gradient(135deg, #7c3aed, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.4rem; font-weight: 800;">InkyIdentity</span>
        </div>
        <h1 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 12px; color: #f9fafb;">Reset your password</h1>
        <p style="color: #9ca3af; line-height: 1.6; margin-bottom: 24px;">
          Hi ${user.username}, click the button below to reset your password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-bottom: 24px;">
          Reset password
        </a>
        <p style="color: #6b7280; font-size: 0.8rem;">
          If you didn't request this, you can ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });

  console.log('Resend result:', JSON.stringify(result));
  return NextResponse.json({ ok: true });
}
