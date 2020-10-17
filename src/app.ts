import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';

const app = express();

app.set('port', process.env.PORT || 3000);

// middleware
app.use(bodyParser.json());

// routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'ok' });
});

export default app;
