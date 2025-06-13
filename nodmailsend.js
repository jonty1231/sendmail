import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'futureittouch@gmail.com',
    pass: "xmnkckbdtskzyfuh",
  }
}); 

export const sentMail = async ({ keys, values, sendto, subject }) => {
  let htmlarray = [];

  keys.forEach((item, index) => {
let code = `<div style="
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
">
  <b style="
    color: #4f46e5;
    font-weight: 600;
  ">${item}</b>: 
  <span style="
    color: #374151;
    margin-left: 0.25rem;
  ">${values[index]}</span>
</div>`;


htmlarray.push(code);
  });

  const fullhtml = htmlarray.join(" ");

  const mailOptions = {
    from: "futureittouch@gmail.com",
    to: sendto,
    subject: subject,
    html: `<div> ${htmlarray} </div>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
