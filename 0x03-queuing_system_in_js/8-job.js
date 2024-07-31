import kue from 'kue';

/**
 * Creates push notification jobs in the specified queue.
 * @param {Array} jobs - Array of job objects with phoneNumber and message properties.
 * @param {Object} queue - The Kue queue to add jobs to.
 */
function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    jobs.forEach(jobData => {
        const job = queue.create('push_notification_code_3', jobData)
            .save(err => {
                if (err) {
                    console.error(`Notification job failed: ${err}`);
                } else {
                    console.log(`Notification job created: ${job.id}`);
                }
            });

        // Job events
        job.on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        });

        job.on('failed', (err) => {
            console.error(`Notification job ${job.id} failed: ${err}`);
        });

        job.on('progress', (progress) => {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });
    });
}

export default createPushNotificationsJobs;

