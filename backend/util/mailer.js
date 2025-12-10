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

//dummy function to get the app running
export async function sendEmail(to, subject, text) {
    console.log(`📧 [MOCK EMAIL SENT]`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    // console.log(`   Body: ${text}`); 
    return true; 
}