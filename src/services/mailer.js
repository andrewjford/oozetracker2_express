import sgMail from '@sendgrid/mail';

const hostUrl = process.env.HOST_URL;

const mailer = {
  async sendVerificationMessage(toEmail, token) {
    const sendGridMail = sgMail;
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: toEmail,
      from: 'Cash Tracker',
      subject: 'Welcome to Cash Tracker! Please Confirm Your Email',
      text: `Click on this link to verify your email ${hostUrl}/verification?token=${token}&email=${toEmail}`,
      html: `<strong>
        Click <a href="${hostUrl}/api/v1/verification?token=${token}&email=${toEmail}">here</a> to verify your email
        </strong>`,
    };
    sendGridMail.send(msg);
  }
}

export default mailer;