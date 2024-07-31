import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.message);
});

const hashKey = 'HolbertonSchools';
const schools = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2
};

// Store hash values using hset
for (const [field, value] of Object.entries(schools)) {
  client.hset(hashKey, field, value, redis.print);
}

// Retrieve and display hash values using hgetall
client.hgetall(hashKey, (err, obj) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(obj);
  }
});
