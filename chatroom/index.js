import express from 'express'
const app = express();
import http from 'http'
import {setupSocketIO} from './Controllers/socket/chatsocket.js'
import {jwtMiddleware} from "./Middlewares/valdaions/jwtvalidation.js"
import {connectDB} from "./configs/db.config.js"
import cors from "cors"
import dotenv from "dotenv"
import { Server as socketIo } from 'socket.io';
const server = http.createServer(app);
const io = new socketIo(server);
import Router from './Routes/UserRoutes.js';
dotenv.config()

// CORS options
const corsOptions = {
  origin: "*", // Adjust this based on your requirements
  credentials: true,
  optionSuccessStatus: 200,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", Router);
setupSocketIO(io);
io.use(jwtMiddleware)

// Connect to MongoDB using Mongoose (assuming connectDB function does this)
connectDB();
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
