import express, { Request, Response, NextFunction as Next } from "express";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";
import Redis from "ioredis";
import { PromiseWrapper, AsyncWrapper } from "./helpers/async-handler";

const app = express();

const RedisClient = new Redis();

RedisClient.on("connect", () => console.log("redis connected!"));
RedisClient.on("error", (err) => {
  console.error(err);
  RedisClient.quit();
});

app.use(cors({ origin: "*" })); // don't do this in your production apps, always restrict your cors origin
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("<h1>let's code!</h1>");
});

app.get("/api/photos", async (_req: Request, res: Response, next: Next) => {
  const retrievePhotosFromCache = async () => RedisClient.get("photos")
  const { result: cachedPhotos, error: cacheRetrieveError } = await AsyncWrapper(retrievePhotosFromCache);

  if (cacheRetrieveError) return next(cacheRetrieveError);
  if (cachedPhotos) return res.json(JSON.parse(cachedPhotos));

  const url = "https://jsonplaceholder.typicode.com/photos";
  const { result: response, error: fetchError } = await PromiseWrapper(axios.get(url));
  const data = response?.data;
  const dataToCache = JSON.stringify(data)

  if (fetchError) return next(fetchError);

  const savePhotosToCache = async () => RedisClient.set("photos", dataToCache)
  const { error: cacheSaveErr } = await AsyncWrapper(savePhotosToCache);

  if(cacheSaveErr) console.error(cacheSaveErr)
  return res.json(data);
});

export default app;
