import express from 'express';
import dotenv from "dotenv"
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoutes.js'
import tweetRoute from './routes/tweetRoutes.js';
import cors from "cors";

dotenv.config({
  path: '.env'
});
connectDB()  
const app = express();

// middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cookieParser());

// cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
}
app.use(cors(corsOptions));
// api

app.use('/api/v1/user', userRoute);
app.use("/api/v1/tweet", tweetRoute);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});