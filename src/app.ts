import express, { Request, Response } from "express";

const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: 'ok'});
});

export default app;