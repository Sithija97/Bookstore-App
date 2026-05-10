import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (res: express.Response) => {
  res.json({ message: "Welcome to Bookstore API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
