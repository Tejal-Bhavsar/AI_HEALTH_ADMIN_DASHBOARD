import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './db';
import companiesRouter from './routes/companies';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/companies', companiesRouter);
app.use('/api/users', usersRouter);

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
