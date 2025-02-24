import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import usersRoutes from "./routes/usersRoutes";
import booksRoutes from "./routes/booksRoutes";

const app = express();
const port = 3004;

app.use(cors());

app.use(express.json());
app.use("/", usersRoutes);
app.use("/", booksRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from the server!" });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
