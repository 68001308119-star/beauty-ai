const express = require("express");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/api/analyze", async (req, res) => {
    try {
        const { age, skin, face, style } = req.body;

        const prompt = `
คุณคือ Beauty AI ผู้ช่วยแนะนำความงาม

ข้อมูลของผู้ใช้:
- อายุ: ${age} ปี
- สภาพผิว: ${skin}
- รูปหน้า: ${face}
- สไตล์ที่ชอบ: ${style}

กรุณาให้คำแนะนำด้านความงาม โดยวิเคราะห์หัวข้อต่อไปนี้:

1. ทรงผมที่เหมาะสม
2. การแต่งหน้าที่เหมาะสม
3. โทนสีเครื่องสำอางที่เหมาะสม
4. สีและสไตล์เล็บ
5. สไตล์การแต่งตัว
6. คำแนะนำเพิ่มเติม

ข้อกำหนด:
- ตอบเป็นภาษาไทย
- ใช้ภาษาที่เข้าใจง่าย
- แบ่งคำตอบเป็นหัวข้อ
- ให้คำแนะนำที่เหมาะกับข้อมูลของผู้ใช้
- ไม่วินิจฉัยโรค
- ไม่ให้คำแนะนำทางการแพทย์
`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "คุณเป็นผู้ช่วยด้านความงามที่สุภาพ ให้คำแนะนำที่เข้าใจง่ายและเป็นประโยชน์"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "openai/gpt-oss-20b",
            temperature: 0.7
        });

        const result = completion.choices[0].message.content;

        res.json({
            result: result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "ไม่สามารถเชื่อมต่อ AI ได้ กรุณาตรวจสอบ API Key"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Beauty AI running on port ${PORT}`
    );
});