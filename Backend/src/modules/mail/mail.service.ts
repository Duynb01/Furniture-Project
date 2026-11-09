import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as process from 'node:process';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set');
    }
    this.resend = new Resend(apiKey || 'dummy');
  }

  async sendPasswordReset(email: string, resetLink: string) {
    const fromEmail = process.env.MAIL_FROM || 'onboarding@resend.dev';
    const { error } = await this.resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Khôi phục mật khẩu - Furniture Store',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Yêu cầu khôi phục mật khẩu</h2>
          <p>Bạn nhận được email này vì đã gửi yêu cầu đặt lại mật khẩu cho tài khoản tại Furniture Store.</p>
          <p>Vui lòng nhấn vào liên kết bên dưới để tạo mật khẩu mới:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" target="_blank" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Đặt lại mật khẩu
            </a>
          </p>
          <p>Hoặc copy link sau dán vào trình duyệt: <br/><a href="${resetLink}">${resetLink}</a></p>
          <p><i>Lưu ý: Liên kết này chỉ có hiệu lực trong 15 phút.</i></p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Gửi email thất bại: ${error.message}`);
    }

    return { message: 'Email reset password đã được gửi' };
  }
}
