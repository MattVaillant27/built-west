#!/usr/bin/env node
// One-time CRM setup. Run: node scripts/crm-setup.mjs
// Prints the four secret values to paste into Netlify → Project configuration → Environment variables.
// Nothing is written to disk.
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';
import * as OTPAuth from 'otpauth';
import qrcode from 'qrcode-terminal';

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

const password = await askHidden('Choose a CRM password (12+ characters): ');
if (password.length < 12) { console.error('Too short. Use at least 12 characters.'); process.exit(1); }
if ((await askHidden('Type it again: ')) !== password) { console.error('Passwords did not match.'); process.exit(1); }

const salt = randomBytes(16);
const passwordHash = `scrypt:${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`;
const secret = new OTPAuth.Secret({ size: 20 });
const totp = new OTPAuth.TOTP({ issuer: 'Built West', label: 'CRM', digits: 6, period: 30, secret });

console.log('\n1) Scan this QR code with your authenticator app (1Password, Google Authenticator, etc.):\n');
qrcode.generate(totp.toString(), { small: true });
console.log(`   Can't scan? Enter this key manually: ${secret.base32}\n`);
console.log('2) Add these to Netlify → builtwest → Project configuration → Environment variables');
console.log('   (mark each one "Contains secret values"), then redeploy:\n');
console.log(`CRM_PASSWORD_HASH=${passwordHash}`);
console.log(`CRM_TOTP_SECRET=${secret.base32}`);
console.log(`CRM_SESSION_SECRET=${randomBytes(32).toString('base64url')}`);
console.log(`CRM_CALENDAR_TOKEN=${randomBytes(24).toString('base64url')}`);
console.log('\n3) Sign in at https://builtwest.ca/crm with your password and the 6-digit code from the app.\n');
