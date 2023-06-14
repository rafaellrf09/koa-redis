const { MongoClient } = require('mongodb');

class MongoDb {
    constructor() {
        this.mongoURL = 'mongodb://localhost:27017';
     }

    async connect() {
        try {
            return await MongoClient.connect(this.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
                console.error('MongoDb Connected');
            });
        } catch (error) {
            console.error('Error to connect MongoDB:', err);
            return;
        }
    }
}

module.exports = new MongoDb();


