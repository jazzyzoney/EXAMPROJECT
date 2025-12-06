import nodemailer from "nodemailer"

//ethereal
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ETH_MAIL',
        pass: 'ETH_PASS'
    }
})

export async function sendEmail(to, subject, text) {
    try {
        const info = await transporter.sendMail({
            from: '"Bratz Blog System" <no-reply@bratz.com>',
            to: to,
            subject: subject,
            text: text,
            html: `<b>${text}</b>`
        });

        console.log(`📧 Email sent to ${to}. Preview: ${nodemailer.getTestMessageUrl(info)}`);
        return true;
    } catch (error) {
        console.error("Mailer Error:", error);
        return false;
    }
}