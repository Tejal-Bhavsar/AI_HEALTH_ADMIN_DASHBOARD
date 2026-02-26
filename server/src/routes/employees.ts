import { Router } from 'express';
import { query } from '../db';

const router = Router();

// Get all employees
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM employees ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new employee
router.post('/', async (req, res) => {
    const { name, email, company_id, coverage_details } = req.body;
    try {
        const result = await query(
            'INSERT INTO employees (name, email, company_id, coverage_details) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, company_id, JSON.stringify(coverage_details)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an employee
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, company_id, coverage_details } = req.body;
    try {
        const result = await query(
            'UPDATE employees SET name = $1, email = $2, company_id = $3, coverage_details = $4 WHERE id = $5 RETURNING *',
            [name, email, company_id, JSON.stringify(coverage_details), id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
