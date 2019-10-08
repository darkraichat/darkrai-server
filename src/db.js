const { MongoClient } = require('mongodb')
require('dotenv').config()

const mongo_url = process.env.DB_URL || ''

module.exports.connectdb = dbName => {
  return MongoClient.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(client => {
      console.log('Connected to MongoDB...')
      return client.db(dbName)
    })
    .catch(err => console.log('MongoDB Error:\n', err))
}
