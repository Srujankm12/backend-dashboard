const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow your SvelteKit frontend origin
    methods: ['GET', 'POST'],
  }
});

// Use CORS middleware for HTTP requests
app.use(cors({
  origin: 'http://localhost:5173', // Allow your SvelteKit frontend origin
  methods: ['GET', 'POST'],
}));

// Serve static files from the "public" directory (if needed)
app.use(express.static('public'));

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Function to generate random temperature
  const getRandomTemperature = () => {
    return (Math.random() * 30 + 15).toFixed(2); // Random temperature between 15°C and 45°C
  };

  // Emit random temperature data every 5 seconds
  const sendTemperatureData = () => {
    const tempData = { temp: getRandomTemperature() };
    socket.emit('data', tempData);
  };

  // Start emitting data every 5 seconds
  const intervalId = setInterval(sendTemperatureData, 5000);

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    clearInterval(intervalId); // Stop emitting data when the user disconnects
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

