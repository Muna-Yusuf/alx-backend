import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

// Initialize Express app
const app = express();
const port = 1245;

// Initialize Redis client and Kue queue
const redisClient = redis.createClient();
const kueQueue = kue.createQueue();

// Promisify Redis methods
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Initial setup
const initialSeats = 50;
let reservationEnabled = true;

// Function to reserve seats
const reserveSeat = async (number) => {
    await setAsync('available_seats', number);
};

// Function to get current available seats
const getCurrentAvailableSeats = async () => {
    const seats = await getAsync('available_seats');
    return seats ? parseInt(seats, 10) : 0;
};

// Initialize the available seats on startup
(async () => {
    await reserveSeat(initialSeats);
})();

// Route to get available seats
app.get('/available_seats', async (req, res) => {
    const availableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = kueQueue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: 'Reservation failed' });
        }
        res.json({ status: 'Reservation in process' });
    });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    }).on('failed', (errorMessage) => {
        console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
    });
});

// Route to process the queue
app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });

    kueQueue.process('reserve_seat', async (job, done) => {
        try {
            const currentSeats = await getCurrentAvailableSeats();
            if (currentSeats <= 0) {
                reservationEnabled = false;
                return done(new Error('Not enough seats available'));
            }

            await reserveSeat(currentSeats - 1);
            done();
        } catch (error) {
            done(error);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

