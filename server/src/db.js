const { MongoClient } = require('mongodb')

const mongo_url =
  'mongodb+srv://hit:mongo123@cluster0-gd4cn.mongodb.net/test?retryWrites=true&w=majority'

module.exports.connectdb = dbName => {
  return MongoClient.connect(mongo_url, { useNewUrlParser: true }).then(
    client => client.db(dbName)
  )
}
