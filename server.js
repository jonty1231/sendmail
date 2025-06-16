import express from "express";
import dotenv from "dotenv";
import twilio from "twilio" 
import cors from "cors";
import { sentMail } from "./nodmailsend.js";


const app= express();

app.use(express.json());
app.use(cors());
dotenv.config()




const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client= twilio(accountSid,authToken)


app.get("/",async(req,res)=>{
    return res.json({working:"yes working"})
})

app.post('/api/sendotp',async(req,res)=>{
    try {
        const { phone } = req.body;
           if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required." });
    }

 const verification = await client.verify.services(verifyServiceSid).verifications.create({ to: phone, channel: "sms" });

 return res.status(200).json({ success: true, message: "OTP sent successfully!", sid: verification.sid });

        
    } catch (error) {
                res.status(500).json({ success: false, message: "Failed to send OTP.", error: error.message });

    }
})




app.post("/api/verify-otp", async (req, res) => {
    const { phone, code , formdata, sendto , subject } = req.body;

    if (!phone || !code) {
        return res.status(400).json({ success: false, message: "Phone number and OTP code are required." });
    }

    try {
        const verificationCheck = await client.verify.services(verifyServiceSid)
            .verificationChecks
            .create({ to: phone, code });

        if (verificationCheck.status === "approved") {

            const keys = Object.keys(formdata);     
const values = Object.values(formdata);
await sentMail({keys,values,sendto,subject})


 return     res.status(200).json({ success: true, message: "OTP verified successfully!" });





        } else {
          return  res.status(400).json({ success: false, message: "Invalid OTP." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "OTP verification failed.", error: error.message });
    }
});






app.post("/sendmail",async(req,res)=>{
    const {formdata,sendto,subject}= req.body;
     
   const keys = Object.keys(formdata);     
const values = Object.values(formdata);

  await sentMail({keys,values,sendto,subject})

    return res.status(201).json({success:true,message:"mail send succesfuly"})
})








const PORT = process.env.PORT || 9000

app.listen(PORT,()=>{
    console.log(`APP running on PORT http://localhost:${PORT}`)
})