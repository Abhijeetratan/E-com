import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middlewares/errors.js';
import ProductRoutes from "./routes/products.js";
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Handle Uncaught exception
process.on('uncaughtException', (err) => {
    console.log(`ERROR:,${err}`)
    console.log("Shutting down due to uncaught error");
    process.exit(1);
})


const app = express();
app.use(cors());
dotenv.config({ path: 'backend/config/config.env' });

app.use(express.json({limit:"10mb"}));
app.use(cookieParser());

// Connecting to the database
connectDatabase();

// Import all Routes
app.use("/api/v1", ProductRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);

if (process.env.NODE_ENV === "PRODUCTION") {
    const staticPath = path.join(__dirname, "../backend/client/build");
   // console.log("Static files path:", staticPath); // Log the static files path

    app.use(express.static(staticPath))

    app.get('*', (req, res) => {
        const indexPath = path.resolve(__dirname, "../backend/client/build/index.html");
       // console.log("Index file path:", indexPath); // Log the index.html file path
        res.sendFile(indexPath);
    })
}

// Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled Promise
process.on('unhandledRejection', (err) => {
    console.log(`Error :,${err}`);
    console.log('Shutting down server due to unhandled promise Rejection')
    server.close(() => {
        process.exit(1);
    })
});
