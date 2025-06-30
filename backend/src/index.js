import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app,server} from './lib/socket.js';

dotenv.config();


const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(express.json()); //allows to extraxt JSON data from the request body in login,signup and logout routes
app.use(cookieParser()); //allows to parse cookies from the request headers This middleware is used to parse cookies from the request headers, so that we can access the JWT token stored in cookies during authentication
app.use(cors({
    origin : "http://localhost:5173", //replace with your frontend URL
    credentials: true //allows cookies to be sent with requests
}))
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')));

    app.get('/*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../frontend','dist' ,'index.html'));
    });
}

server.listen(PORT,() => {
    console.log('Server is running on PORT:'+ PORT)
    connectDB(); 
});
