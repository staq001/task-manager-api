// CRUD create read update delete

// THIS FILE HAS NO CONNECTION/AFFILIATION WITH THE APP WE"RE BUILDING. IT'S A PERIPHERAL

const mongodb = require('mongodb')
// this returns an object

const MongoClient = mongodb.MongoClient
// this is one thing we need to initialize the connection.

const ObjectID = mongodb.ObjectId
// helps configure our preferred ids 

// basic destructuring
// const {MongoClient, ObjectID} = mongodb

const connectionURL = 'mongodb://127.0.0.1:27017'
// this connects to our localhost server running in the mongodb terminal
// we could have just typed 'localhost:27017' but localhost is known to slow down applications and fail mostly. the reason is unknown. typing out the entire IP works just fine. 

const databaseName = 'task-manager'
// can pick any name for this. name should most probably match the name of app.

// const id = new ObjectID()
// console.log(id);
// console.log(id.id);
// console.log(id.getTimestamp());
// console.log(id.toHexString())

MongoClient.connect(connectionURL, {
  useNewUrlParser: true
  // the original urlParser by default is being deprecated and it's required to pass in this option in order for our urls to be parsed correctly so we can connect to the server.

  // takes a few arguments to set up the connection- the connectionURL, urlParser and a callback function(asynchronous)
}, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database')
  }
  const db = client.db(databaseName)


  // INSERT-ONE AND INSERT-MANY
  // db.collection('users').insertOne({
  //   name: 'Vikran',
  //   age: 25
  // }, (error, result)=> {
  //   if (error) {
  //     console.log('Unable to insert user')
  //   }
  //   console.log(result.insertedId) // result.ops wont work as it has been
  //   console.log(result.acknowledged) // removed from the new version
  // })

  //   db.collection('users').insertMany([
  // {
  //   name: 'Jen',
  //   age: 28
  // }, {
  //   name: 'Gunther',
  //   age: 27
  // }
  //   ], (error, result)=> {
  //     if (error) {
  //       console.log('Unable to insert documents')
  //     }

  //     console.log(result.insertedIds)
  //     console.log(result.acknowledged)
  //   })

  // db.collection('tasks').insertMany([{
  //   description: 'Get the ball',
  //   completed: true
  // }, {
  //   description: "Set the ball",
  //   completed: false
  // }, {
  //   description: 'Shoot the ball',
  //   completed: true
  // }], (error, result) => {
  //   if (error){
  //    return console.log('Unable to insert tasks')
  //   }

  //   console.log(result.insertedIds)
  //   console.log(result.acknowledged)
  // })

  // FIND-ONE AND FIND_MANY
  // db.collection('users').findOne({_id: new ObjectID('63a09ea405e7a3ce379fcb76')}, (error, user)=> {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(user)
  // })

  // db.collection('users').find({age: 27}).toArray((error, users)=>{
  //   if (error){
  //     console.log('Unable to fetch');
  //   }
  //   console.log(users)
  // })

  // db.collection('users').find({age:27}).count((error, count)=> {console.log(count)}) // returns the count of the obkects matching the parameter we're searching for

  // challenge

  // db.collection('tasks').findOne({ _id: ObjectID('63a090135f620e98c5b90bab') }, (error, user) => {
  //   if (error) {
  //     return console.log(error);
  //   }

  //   console.log(user)
  // })

  // db.collection('tasks').find({ completed: true }).toArray((error, tasks) => { console.log(users) })


  // UPDATE_ONE AND UPDATE-MANY
  // db.collection('users').updateOne({ _id: ObjectID('63a08216a5e557cae350d646') }, {
  //   $inc: {
  //     age: 1 // -1
  //   }
  // }).then((result) => {
  //   console.log(result)
  // }).catch(() => {
  //   console.log(error)
  // })

  // db.collection('tasks').updateMany({ completed: false }, {
  //   $set: {
  //     completed: true
  //   }
  // }).then((result) => {
  //   console.log(result);
  // }).catch((error) => {
  //   console.log(error);
  // })

  // DELETE_ONE AND DELETE_MANY
  //   db.collection('users').deleteMany({
  //     age: 27,
  //   }).then((result) => { console.log(result) }).catch((error) => {
  //     console.log(error)
  //   })


  // db.collection('tasks').deleteOne({ completed: true }).then((result) => {
  //   console.log(result);
  // }).catch((error) => {
  //   console.log(error);
  // })
})
