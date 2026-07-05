import express from 'express'
import type { Request, Response } from 'express'

const app = express()

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

export { app }