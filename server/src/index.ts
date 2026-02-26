import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './db';
import companiesRouter from './routes/companies';
import usersRouter from './routes/users';
import employeesRouter from './routes/employees';
import claimsRouter from './routes/claims';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Explicitly configure CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/api/companies', companiesRouter);
app.use('/api/users', usersRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/claims', claimsRouter);

app.get('/api/health', async (req, res) => {
    const dbStatus = await checkDatabaseConnection();
    res.json({
        status: 'ok',
        message: 'Server is running',
        database: dbStatus ? 'connected' : 'disconnected'
    });
});

const startServer = async () => {
    await checkDatabaseConnection();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();
