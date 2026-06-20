const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 根路徑測試
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// 前端對接的 API 路由
app.post('/api/scan', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: '後端未設定 GEMINI_API_KEY 環境變數' });
        }

        // 使用標準原生 fetch 直連 Gemini API，完美適應前端傳來的結構
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // 直接轉發前端精準構造的 payload
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini API 回傳錯誤:', data);
            return res.status(response.status).json(data);
        }

        // 回傳給前端
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
