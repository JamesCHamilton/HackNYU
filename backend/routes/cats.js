import express from "express";
const router = express.Router();

router.get('/api/cat', (req, res) => {
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = Date.now();

    if (!cachedCatUrl || (now - lastFetched) > oneDay) {
        fetchCatImage().then(() => {
            res.json({ catUrl: cachedCatUrl });
        });
    } else {
        res.json({ catUrl: cachedCatUrl });
    }
});
