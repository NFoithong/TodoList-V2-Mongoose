//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// connect the database     useNewUrlParser -> Deprecation Warning Options
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true })

// create item schema
const itemsSchema = {
    name: String
};

// create new model from this syntax
// const Name = mongoose.model(<'SingularCollectionName'>,<schemaName>);
const Item = mongoose.model('Item', itemsSchema);

// create new document using mongoose from this syntax
// const <constantName> = new <ModelName> ({<fieldName>:<fieldData>, ...})

const item1 = new Item({
    name: 'Welcome to your todolist'
});

const item2 = new Item({
    name: 'Hit the + button to add a new item'
});

const item3 = new Item({
    name: '<-- Hit this ti delte an item>'
});

// put all item in array
const defaultItems = [item1, item2, item3];

// mongoose insertMany syntax
// <ModelName>.insertMany(<documentArray>, function(err){ // Deal with error or log success});
// Item.insertMany(defaultItems, function(err) {
//     if (err => console.log(err));
//     console.log('Succesfully saved default item to database')
// })

app.get("/", function(req, res) {
    // delete
    // const day = date.getDate();
    // res.render("list", {listTitle: day, newListItems: items});

    // create mongoose find() : log every item on items collection
    // ModelName.find({conditions}, function(err, results){ // use the found results docs.})
    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            // mongoose insertMany syntax
            // <ModelName>.insertMany(<documentArray>, function(err){ // Deal with error or log success});
            Item.insertMany(defaultItems, function(err) {
                if (err => console.log(err));
                console.log('Succesfully saved default item to database')
            });
            res.redirect('/');
        } else {
            // console.log(foundItems);
            res.render("list", { listTitle: 'Today', newListItems: foundItems });
        }
    })
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem
        // const item = req.body.newItem;
    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect('/');

    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
});

// delete
app.post('/delete', function(req, res) {
    // console.log(req.body);
    const checkedItemId = req.body.checkbox;

    // delete particular id by using mongoose findByIdAndRemove()
    // modelName.findByIdAndRemove(id, function(err){});
    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (!err) {
            console.log('Succesfully delete checked item');
            res.redirect('/');
        }
    })
});

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});