import express, {Request, Response} from "express";

const app = express();
const port = 3000;

app.use (express.json());

app.get("/users", (req: Request, res: Response) => {
    res.json([{id:1, name: "Alice"}])
});

app.post("/users", (req: Request, res: Response) => {
    const {name} = req.body;
    res.status(201).json({id: 2, name});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


