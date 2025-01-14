const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Import Modules 
const {connectDB} = require('./db/connect');
const {disconnectDB} = require('./db/disconnect');

// Configure Env Variables.
dotenv.config();
const port = process.env.PORT || 5500;
const live = process.env.LIVE || 'http://localhost:';
const mongoURI = process.env.MONGO_URI || `mongodb://localhost:27017/trackIT`;

// Configure static file path
const publicDirectoryPath = path.join(__dirname, 'public');
const filePath = path.join(publicDirectoryPath, 'index.html');

// Create express instance.
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(publicDirectoryPath));

// Serve root Req
app.get('/', (req, res) => {
    res.status(200).sendFile(filePath);
});

const start = async () => {
    try {
        // Check if required environment variables are set

        if (!mongoURI) {
            console.error('MONGO_URI environment variable is not set.');
            process.exit(1);
        }

        await connectDB(mongoURI);
        app.listen(port, () => {
            console.log(`Server is listening to port ${port} happily`);
            console.log(`GO Live: ${live}${port}/`)
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
}

start();

// ShutDown on SIGINT signal.
process.on('SIGINT', () => {
    console.log('Shutting down gracefully');

    try {
        disconnectDB();
        console.log('db Disconnected');
    } catch (err) {
        console.log("Error disconnecting mongoDB", err);
    }

    process.exit(0);
});