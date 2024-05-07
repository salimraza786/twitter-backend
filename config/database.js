import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
   path: "../config/.env" 
});

const connectDB = async () => {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() =>{
    console.log(" connected to mongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  })
}
export default connectDB