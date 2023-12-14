const { Kafka } = require('kafkajs');
//https://dev.to/ebukaodini/using-kafkajs-with-aws-msk-on-a-nodejs-lambda-function-5e41
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
     try {
         await consumer.connect();
         await consumer.subscribe({topic: 'db.db.test', fromBeginning: false});

         await consumer.run({
             eachMessage: async ({topic, partition, message}) => {
                 const {value} = message
                 if (value) {
                     const data = JSON.parse(message.value.toString())
                     const {before, after} = data || {}
                     if (before) {
                         console.log('before', before)
                     }
                     if (after) {
                         console.log('after', after)
                     }
                 }
             },
         });
     } catch (e) {
         console.error(e);
     }
};

run().catch(console.error);
