var express = require('express');
var router = express.Router();
// let db = require('../db');
var mongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017/";
const sendmail = require('sendmail')();

var myCollection;
var db;

router.get("/:orderno", (req, res, next) => {
  var orderNo = req.params.orderno;
  createConnection( "mongodb://localhost:27017/", "eCommerceTempleteDB", "orderedList", () => {
    myCollection.find({
        orderNo: orderNo
          }).toArray((err, orderDetails) => {
            if (orderDetails.length > 0){
              createConnection("mongodb://localhost:27017/", "eCommerceTempleteDB", "userdetails", () => {
                var userId01 = orderDetails.userId;
                myCollection.find({
                  userId: 001
                    }).toArray((err, result) => {
                      if(err) throw err;
                      console.log("resultttttttttttttttttttttttt", result);
                    });
              });
                sendmail({
                  from: 'reinmohanraj@gmail.com',
                  to: 'liebenswertmohan@gmail.com',
                  subject: 'Your Order ID : ' + orderNo,
                  html: `you ordered list of products` ,
                }, (err, reply) => {
                  console.log(err && err.stack);
                  console.dir(reply);
              });
                res.json({
                  product: orderDetails
                });
              }
              else{
                res.json({
                  message: "No products with that orderNo"
                });
              }
            });
  });
});


var createConnection = (url, dbName, collectionName, onCreate) => {
 
  mongoClient.connect(url, (err, db) => {
      if(err)
          throw err;
      console.log("connected to the mongoDB !");
      myCollection = db.db(dbName).collection(collectionName);

      onCreate();
  });
}


module.exports = router;