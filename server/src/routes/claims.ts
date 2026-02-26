import { Router } from 'express';
import { query } from '../db';
import { analyzeClaim } from '../utils/ai_utils';

const router = Router();

// Get all claims
router.get('/', async (req, res) => {
    try {
        const result = await query(`
            SELECT c.*, e.name as employee_name 
            FROM claims c 
            JOIN employees e ON c.employee_id = e.id 
            ORDER BY c.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new claim
router.post('/', async (req, res) => {
    const { employee_id, amount, service_date, provider_name, diagnosis_code, description } = req.body;
    try {
        // AI Integration: Perform automated analysis
        const analysis = await analyzeClaim({ amount, description });

        const result = await query(
            'INSERT INTO claims (employee_id, amount, service_date, provider_name, diagnosis_code, description, status, ai_analysis) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [employee_id, amount, service_date, provider_name, diagnosis_code, description, analysis.status, JSON.stringify(analysis)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a claim
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, service_date, provider_name, diagnosis_code, description, status, ai_analysis } = req.body;
    try {
        const result = await query(
            'UPDATE claims SET amount = $1, service_date = $2, provider_name = $3, diagnosis_code = $4, description = $5, status = $6, ai_analysis = $7 WHERE id = $8 RETURNING *',
            [amount, service_date, provider_name, diagnosis_code, description, status, JSON.stringify(ai_analysis), id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Claim not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a claim
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM claims WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Claim not found' });
            return;
        }
        res.json({ message: 'Claim deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
