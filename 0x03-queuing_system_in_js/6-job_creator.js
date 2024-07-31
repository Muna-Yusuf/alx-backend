import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Job data
const jobData = {
    phoneNumber: '1234567890',
    message: 'Hello, this is a test message!'
};

// Create a job
const job = queue.create('push_notification_code', jobData)
    .save((err) => {
        if (!err) {
            console.log(`Notification job created: ${job.id}`);
        } else {
            console.error('Error creating job:', err);
        }
    });

// Job completed event
job.on('complete', () => {
    console.log('Notification job completed');
});

// Job failed event
job.on('failed', () => {
    console.log('Notification job failed');
});

