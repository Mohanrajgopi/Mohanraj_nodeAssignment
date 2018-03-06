const express = require("express");
const router = express.Router();
const fs = require("fs");

var readStream = fs.createReadStream("./dB.json");

var Category = {};
var productsJson = [];

//Function to save the value in dB.json and send response
var writeDB = (productToSave, res) => {
    let writeStream = fs.createWriteStream("./dB.json");
    writeStream.write(JSON.stringify(productToSave), err => {
    if(err) 
        throw err;
    else{
        let msg = "SUCESSSSSSSSSSSSSSSSSSSSSSSSS";
        res.status(250).json({msg , productToSave});
    }
});
}

//Reading details from json file
readStream.on("data", data => {
    productsJson = JSON.parse(data);
});

//Initial url hit
router.get("/", (req, res, next) => {
    res.json({productsJson});
});

//get method for the addition of product in json file(database)
router.get("/addProduct", (req, res, next) => {
    res.json({productsJson});
});

//post method for the addition of product in json file(database)
router.post("/addProduct", (req, res, next) => {
    req.body.id = productsJson.products.length + 1;
    productsJson.products.push(req.body);
    writeDB(productsJson, res);
});

//get method in order to edit data corresponding to given id
router.get("/edit/:id", (req, res, next) => {
    let  idx = productsJson.products.findIndex(p => p.id == req.params.id);
    res.json({ productDetails: productsJson.products[idx]});
});

//post method to edit data corresponding to given id
router.post("/edit/:id", (req, res, next) => {
    let  idx = productsJson.products.findIndex(p => p.id == req.params.id);
    req.body.id = req.params.id;
    productsJson.products[idx] = req.body;
    writeDB(productsJson, res);

});

//get method to delete the product in database 
router.get("/del/:id", (req, res, next) => {
    let  idx = productsJson.products.findIndex(p => p.id == req.params.id);
    productsJson.products.splice(idx, 1);
    writeDB(productsJson, res);
});

//post method to view the products using id and productName
router.post("/view", (req, res, next) => {
    if(req.body.id){
        let  idx = productsJson.products.findIndex(p => p.id == req.body.id);
        res.json({SEARCHED_PRODUCT : productsJson.products[idx]});
    }
    else if(req.body.productName){
        res.json({ SEARCHED_PRODUCTS : productsJson.products.filter(p => p.productName == req.body.productName)});
    }
});

//get method to view the products under some category
router.get("/viewCategory", (req, res, next) => {
    let overAllCategory = [];
    productsJson.products.forEach(element => {
        overAllCategory.push(element.category);
    });
    let catergories = overAllCategory.sort().reduce((init, current) => {
        if (init.length === 0 || init[init.length - 1] !== current) {
            init.push(current);
        }
        return init;
    }, []);
    catergories.forEach(categoryElement => {
        let currentCategory = [];
        productsJson.products.forEach(productElement => {
            if(categoryElement == productElement.category){
                currentCategory.push(productElement);
            }
        });
        Category[categoryElement] = currentCategory;
    });
    res.json({overAll : Category });
});

router.get("/search", (req, res, next) => {
    let searchResult = productsJson.products.filter( obj => {
        return obj.productName.toString().toLowerCase().includes(req.query.val.toLowerCase());
    });
    res.json({ searchresult: searchResult });
});

router.get("/globalSearch/:val", (req, res, next) => {
    let globalSearchResult = [];  
    globalSearchResult = productsJson.products.filter(obj => {
      return Object.keys(obj).some(key => {
        return obj[key]
          .toString()
          .toLowerCase()
          .includes(req.params.val.toLowerCase());
      });
    });
    res.json({ globalSearchResult: globalSearchResult });
  });


module.exports = router;