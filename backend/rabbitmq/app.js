const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
const port = 3000;

// Use CORS middleware
const corsOptions = {
  origin: 'http://localhost:80',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); 


app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!!!');
});

app.post('/publish', async (req, res) => {
  const message = req.body.message;

  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'linkedout-queue'; // Updated queue name

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: false });

    // Send message to the queue
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to RabbitMQ: ${message}`);

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);

    res.send('Message sent to RabbitMQ');
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/messages', async (req, res) => {
  const query = req.query; // Get query parameters
  let filter = {};

  // Use query parameters to filter messages
  if (query && query.sender) {
    filter.sender = query.sender;
  }

  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'linkedout-queue'; // Updated queue name

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: false });

    // Consume messages from the queue
    const messages = await new Promise((resolve) => {
      const result = [];

      channel.consume(queue, (msg) => {
        if (msg) {
          const message = msg.content.toString();
          console.log(`Received message from RabbitMQ: ${message}`);

          // Filter messages based on query parameters
          if (Object.keys(filter).length === 0 || filter.sender === message) {
            result.push(message);
          }

          channel.ack(msg); // Acknowledge the message

          if (result.length === messagesCount) {
            resolve(result);
          }
        }
      });
    });

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);

    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages from RabbitMQ:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Consume messages when the server is ready
async function consumeMessages() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'linkedout-queue'; // Updated queue name

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: false });

    // Consume messages from the queue
    channel.consume(queue, (msg) => {
      if (msg) {
        console.log(`Received message from RabbitMQ: ${msg.content.toString()}`);
        channel.ack(msg); // Acknowledge the message
      }
    });
  } catch (error) {
    console.error('Error consuming messages from RabbitMQ:', error);
  }
}

// Start consuming messages when the server is ready
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Consuming messages from RabbitMQ...');
  consumeMessages().catch((err) => console.error(err));
});
