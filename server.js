const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.post('/api/scan', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: '後端未設定 GEMINI_API_KEY 環境變數' });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini API 回傳錯誤:', data);
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error('後端內部發生錯誤:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`伺服器正運行於 port ${PORT}`);
});
