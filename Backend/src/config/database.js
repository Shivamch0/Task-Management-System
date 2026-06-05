import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
import dns from 'dns';

dns.setServers(["1.1.1.1" , "8.8.8.8"])

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("Database connected successfully...")
    } catch (error) {
        console.log("Database connection failed..." , error);
        process.exit(1)
    }
}

export default connectDb