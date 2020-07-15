const express = require('express');
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const app = express();
const post = require('./models/postData');

app.use(express.json());

const kafka = new Kafka({
    clientId: 'contoh-topic',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: '53ggsfw3' });

const run = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'contoh-topic', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ message }) => {
            console.log(message.value.toString())
            const postDataMongo = new post({
                description: message.value.toString()
            });
            try {
                postDataMongo.save();
            } catch (err) {
                res.json({ message: err });
            }
        },
    })
};

run().catch(console.error);

app.get('/', async (req, res) => {
    try {
        const posts = await post.find();
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});


mongoose.connect('mongodb://localhost:27017/testKafka', { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("MongoDB has been connected"));

app.listen(4000, () => console.log('Server running!'));
