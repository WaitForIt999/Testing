import express, { Request, response } from 'express'
import path from 'node:path';

const app = express();

app.post('/api/upload-cv', (req:Request, res:Response) :void => {
    const uploadPdfPath = path.join(__dirname,'uploads', '_CV.pdf')
})