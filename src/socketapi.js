let socket_io = require('socket.io');
let io = socket_io();
let socketAPI = {};
//Your socket logic here
socketAPI.io = io;
module.exports = socketAPI;