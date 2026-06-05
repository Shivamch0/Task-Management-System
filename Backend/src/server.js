import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDb from './config/database.js';

const port = process.env.PORT || 5000;

connectDb()
.then(() => {
    app.listen(port , () => {
        console.log("Server is listening on port : ", port )
    })
})
.catch((error) => {
    console.log("Server failed due to database failure...")
    process.exit(1)
})