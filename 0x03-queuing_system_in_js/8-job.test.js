import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('createPushNotificationsJobs', function() {
  let queue;
  
  beforeEach(() => {
    queue = kue.createQueue();
    kue.testMode.enter();
  });

  afterEach(() => {
    kue.testMode.exit();
    return queue.removeAsync(); // Ensure the queue is cleared
  });

  it('should display an error message if jobs is not an array', function(done) {
    try {
      createPushNotificationsJobs('invalid', queue);
    } catch (err) {
      expect(err.message).to.equal('Jobs is not an array');
      done();
    }
  });

  it('should create jobs and handle job events', function(done) {
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' }
    ];
    
    createPushNotificationsJobs(jobs, queue);

    queue.on('job enqueue', (id, type) => {
      expect(type).to.equal('push_notification_code_3');
    });

    queue.on('job complete', (id) => {
      expect(queue.testMode.jobs.length).to.equal(2);
      done();
    });
  });
});

