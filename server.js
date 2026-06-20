const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scan', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY; 
    const payload = req.body; 

    if (!apiKey) return res.status(500).json({ error: "伺服器未設定 API Key" });

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error(`API 錯誤狀態碼: ${response.status}`);
        res.json(await response.json());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Backend is running!'));