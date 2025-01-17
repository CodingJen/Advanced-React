import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
  <div style="border: 1px solid black;
  padding:20px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 20px;">
  <h2>Hello there</h2>
  <p>${text}</p>
  <p>Love ya 😘, Jennifer</p>
  </div>
  `;
}

export async function sendPasswordResetEmail(resetToken: string, to: string): Promise<void> {
  const info = await transport.sendMail({
    to,
    from: 'codingjennifer@gmail.com',
    subject: 'Your password reset token',
    html: makeANiceEmail(`
    Here is your password reset link.
    <a href="${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}">Click here to reset!</a>
    `),
  });

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Message Sent. Preview it at ${getTestMessageUrl(info)}`);
  }
}
