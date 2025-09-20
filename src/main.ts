import express from 'express';
import http from "http";
import { ENV } from './config/loadEnv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import monasteryRoutes from './routes/monasteryRoutes';
import eventRoutes from './routes/eventRoutes';
import postRoutes from './routes/postRoutes';
import { initWebSocketServer } from './ws/websocket';  // Import the websocket initializer
import notificationRoutes from './routes/notificationRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/monastery', monasteryRoutes);
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/notification', notificationRoutes);

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize WebSocket server on the same HTTP server
initWebSocketServer(server);

server.listen(ENV.PORT, () => {
    console.log(`App listening at PORT: ${ENV.PORT}`);
});
