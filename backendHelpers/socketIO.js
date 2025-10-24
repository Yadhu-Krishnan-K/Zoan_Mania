const express = require('express')
const {createServer} = require('node:http')
const {Server} = require('socket.io')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


const userSocketMap = {};
const getReceiverSocketId=(userId)=>{
    return userSocketMap[userId]
}
io.on('connection',(socket)=>{
    console.log('a user connected')
    socket.on('register user',(userId)=>{
        console.log('one user loging in, user-ID: ',userId)
        userSocketMap[userId] = socket.id;
    })

})




module.exports = {io, app, httpServer, getReceiverSocketId}