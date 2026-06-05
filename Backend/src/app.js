
import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors());
app.use(cookieParser())

app.use(express.json({ limit : '16kb'}));
app.use(urlencoded( { extended : true} ));

//! Routes Import
import userRouter from './routes/user.route.js';

app.use("api/v1/user" , userRouter)

export default app;