import { Router } from 'express';
import { query } from '../db';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM companies ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const { name, plan_details } = req.body;
    try {
        const result = await query(
            'INSERT INTO companies (name, plan_details) VALUES ($1, $2) RETURNING *',
            [name, plan_details]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, plan_details } = req.body;
    try {
        const result = await query(
            'UPDATE companies SET name = $1, plan_details = $2 WHERE id = $3 RETURNING *',
            [name, plan_details, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM companies WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }
        res.json({ message: 'Company deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
