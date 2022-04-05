import express, { Request, Response, NextFunction as Next } from "express";
import axios from "axios";
import cors from "cors"
import morgan from "morgan";
import { PromiseWrapper } from "./helpers/async-handler";

const app = express();

app.use(cors({ origin: "*"})) // don't do this in your production apps, always restrict your cors origin
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

app.get("/", (_req, res) => {
  res.send("<h1>let's code!</h1>");
});

app.get("/api/photos", async (_req: Request, res: Response, next: Next) => {
  const url = "https://jsonplaceholder.typicode.com/photos";
  const {result: response, error: fetchError} = await PromiseWrapper(axios.get(url)); // fetches 5000 images

  if (fetchError) return next(fetchError);
  return res.json(response?.data);
});

export default app;