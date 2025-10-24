const express = require('express')
const {createServer} = require('node:http')
const {Server} = require('socket.io')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

module.exports = {io,app,httpServer}