var mongoClient = require('mongodb').MongoClient;
var dbConfig = require("./confiq.json");




module.exports.createConnection = (onCreate) => {
  var myCollection;
  var db;
  MongoClient.connect('mongodb://localhost:27017/eCommerceTempleteDB', function(err, db) {
      if(err)
          throw err;
      console.log("connected to the mongoDB !");
      myCollection = db.collection('orderDetails');

      onCreate();
  });
}


// module.exports.connect = () => {
//   var url = dbConfig.host + dbConfig.port + "/";
//   console.log("urlllllllll", url);
//   var connection = mongoClient.connect(url);
// }

// module.exports.collect = () => {}

// module.exports.app = () =>{
//   var url = dbConfig.host + dbConfig.port + "/";
//   console.log("urlllllllll", url);
//   var connection = mongoClient.connect(url).then(
//     () => {
//       return db.collection("orderedList");
//     },
//     (err) => {
//       return err;
//     }
//   ); 
// }