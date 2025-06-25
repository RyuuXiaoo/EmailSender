const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alfatharraby5@gmail.com',
        pass: 'hafl ivvd ulfc smlg'
    }
});

app.post('/send-email', async (req, res) => {
    const { to1, to2, to3, to4, to5, subject, text, validkey } = req.body;
    const expectedKey = 'Alfath123@'; 
    if (validkey !== expectedKey) {
        return res.status(403).send('<h2>Key tidak valid! 🚫</h2><a href="/">Kembali</a>');
    }
    const recipients = [to1, to2, to3, to4, to5].filter(email => email && email.trim() !== '');
    if (recipients.length === 0) {
        return res.status(400).send('<h2>Minimal isi 1 email ya! 💌</h2><a href="/">Balik</a>');
    }
    let successList = [];
    let failedList = [];
    for (const email of recipients) {
        const mailOptions = {
            from: '"Email Support" <alfatharraby5@gmail.com>',
            to: email,
            subject,
            html: `
              <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f3ff; border-radius: 10px; border: 1px solid #ddd;">
                <h2 style="color: #6a1b9a;">📨 Pesan dari Customer Service</h2>
                <p style="font-size: 16px; color: #333;">${text.replace(/\n/g, '<br>')}</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px dashed #aaa;" />
                <p style="font-size: 12px; color: #888;">Pesan ini dikirim melalui Email - powered by Alfath Premium Canva 💜</p>
              </div>
            `
        };
        try {
          await transporter.sendMail(mailOptions);
          successList.push(email);
        } catch (err) {
          console.error(`Gagal kirim ke ${email}:`, err.message);
          failedList.push(email);
        }
    }
    let responseHtml = `<h2>📬 Hasil Pengiriman</h2>`;
    if (successList.length > 0) {
        responseHtml += `<p>✅ Berhasil ke:</p><ul>${successList.map(e => `<li>${e}</li>`).join('')}</ul>`;
    }
    if (failedList.length > 0) {
        responseHtml += `<p>❌ Gagal ke:</p><ul>${failedList.map(e => `<li>${e}</li>`).join('')}</ul>`;
    }
    responseHtml += `<a href="/">Kembali ke Form</a>`;
    res.send(responseHtml);
});

app.listen(port, () => {
  console.log(`Kurumi Email jalan di http://localhost:${port}`);
});
