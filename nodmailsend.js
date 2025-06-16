import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'futureittouch@gmail.com',
    pass: "xmnkckbdtskzyfuh",
  }
}); 

export const sentMail = async ({ keys, values, sendto, subject }) => {
  try {
    const htmlarray = keys.map((item, index) => (
      `<div style="background:#fff; border:1px solid #e5e7eb; border-radius:0.5rem; padding:0.75rem; box-shadow:0 1px 2px #0000000d; transition:all 0.2s ease">
        <b style="color:#4f46e5; font-weight:600">${item}</b>: 
        <span style="color:#374151; margin-left:0.25rem">${values[index]}</span>
      </div>`
    ));

    const mailOptions = {
      from: "futureittouch@gmail.com",
      to: sendto.filter(Boolean).join(', '), 
      subject: subject,
      html: `<div>${htmlarray.join('')}</div>` 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error; // Re-throw the error so the caller can handle it
  }
};