import {Server} from "socket.io"
import http from "http"
import express from "express"

const app=express();
const server=http.createServer(app);

const io= new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]; // Return the socket ID for the given userId if it is online  
}

// made a data structre of map type to store the online users list
const userSocketMap={};// {userid:socket.id}


io.on("connection",(socket) => {
    console.log("A user connected: " + socket.id);

    const userId= socket.handshake.query.userId; // Assuming userId is sent as a query parameter

    if(userId)
        userSocketMap[userId]=socket.id; // Store the userId and socket.id in the map

    // Emit the updated user list to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //Just remember to change it both in your server code (io.emit(...)) and in your client code where you listen for it (socket.on(...)), so they match exactly.

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
        // Remove the user from the map when they disconnect
        delete userSocketMap[userId];
        // Emit the updated user list to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // Add more event listeners here as needed
})


export {io, server, app};