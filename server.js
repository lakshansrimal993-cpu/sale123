const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Public folder එක static ලෙස සැකසීම
app.use(express.static('public'));

let salesData = {};
const ADMIN_PASSWORD = "123"; // ඔබට අවශ්‍ය Admin මුරපදය මෙහි වෙනස් කරගත හැක

io.on('connection', (socket) => {
    // නව User කෙනෙක් සම්බන්ධ වූ විට දැනට ඇති දත්ත යැවීම
    socket.emit('loadInitialData', salesData);

    // Admin Login පරීක්ෂා කිරීම
    socket.on('adminLogin', (pass) => {
        if (pass === ADMIN_PASSWORD) {
            socket.isAdmin = true;
            socket.emit('loginSuccess', true);
        } else {
            socket.emit('loginSuccess', false);
        }
    });

    // Admin විසින් දත්ත වෙනස් කළ විට පමණක් සියල්ලන්ට යැවීම
    socket.on('cellUpdate', (data) => {
        if (socket.isAdmin) {
            salesData = data;
            io.emit('cellUpdated', salesData);
        }
    });
});

// පහත පරිදි PORT එක වෙනස් කරන්න
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});