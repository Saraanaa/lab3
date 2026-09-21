const express = require('express');

const app = express();
const PORT = 3000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Performance endpoint — хурдан хариу
app.post('/cart/add', (req, res) => {
    res.json({
        ok: true,
        items: 1
    });
});

// 2. Performance/Report endpoint — 200-400ms санамсаргүй delay
app.get('/report', async (req, res) => {
    await sleep(200 + Math.random() * 200);

    res.json({
        rows: 20000
    });
});

// 3. Reliability endpoint — ойролцоогоор 5% нь 500 алдаа
app.post('/pay', (req, res) => {
    if (Math.random() < 0.05) {
        return res.status(500).json({
            error: 'gateway timeout'
        });
    }

    res.json({
        paid: true
    });
});

app.listen(PORT, () => {
    console.log(`API: http://localhost:${PORT}`);
});