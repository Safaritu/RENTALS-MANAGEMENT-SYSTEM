const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/units', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM units ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/seed-units', async (req, res) => {
    try {
        const floors = [0, 1, 2, 3, 4];
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
        for (const f of floors) {
            for (const l of letters) {
                const id = f === 0 ? `G${l}` : `${f}${l}`;
                await db.query('INSERT INTO units (id, floor) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, f]);
            }
        }
        res.json({ message: "60 Units Seeded!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
// Route to save a new water reading
router.post('/readings', async (req, res) => {
    const { unitId, reading } = req.body;
    try {
        await db.query(
            'INSERT INTO water_readings (unit_id, reading_value) VALUES ($1, $2)',
            [unitId, reading]
        );
        res.json({ message: "Reading saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;