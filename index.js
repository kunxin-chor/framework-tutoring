const express = require('express');
const hbs = require('hbs'); // for wax-on
const { Db } = require('mongodb');
const wax = require('wax-on'); // for template inheritance
const app =  express();

// initialise the view engine
app.set('view engine', 'hbs')

// initialise express to use static files
// specifically, we need to inform Express which folder to find the static files
// the first parameter to express.static is which folder the static files are in
app.use(express.static('./public'));

// initialise wax-on (after we create the `app`)
wax.on(hbs.handlebars); // set up wax-on
wax.setLayoutPath('./views/layouts'); // where to find layouts

app.use(express.urlencoded({
    'extended': false
}))

// require in mongodb
const mongo = require('mongodb').MongoClient;
const mongoURI = "mongodb+srv://root:rotiprata123@cluster0.0exhq.mongodb.net/?retryWrites=true&w=majority";

// register our own custom helpers here
// first parameter to registerHelpr is the name of the helper
// second parameter is a callback function (it's executed whenever the helper is used)
hbs.handlebars.registerHelper("ifEquals", function(arg1, arg2, options){
    if (arg1==arg2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
})

async function main() {

    // connect to the MongoDB
    // the connect function takes two parameters
    // 1. connection string (AKA the mongoURI)
    // 2. certain options
    const client = await mongo.connect(mongoURI, {
        "useUnifiedTopology": true   // use the latest version of Mongo
    })

    // change the database that we want to use
    const db = client.db("sample_airbnb");

    app.get('/', function(req,res){
        res.render('home')
    })

    app.get('/listings', async function(req,res){
        const listings = await db.collection("listingsAndReviews")
        .find()
        .limit(10)
        .toArray();   // required: to convert the results into an array

        res.render("listing.hbs",{
            "listings": listings
        });
    })
    
    app.get('/about-us', function(req,res){
        const locations = [
            {
                "name":"Northpoint Shopping Center",
                "openingHours":[
                    "8am to 1pm", "3pm to 8pm"
                    ]
            },
            {
                "name":"Jurong Point",
                "openingHours":[
                    "8am to 1pm", "3pm to 5pm", "7pm to 11pm"
                    ]
            },
            {
                "name":"Simei Square",
                "openingHours":[
                    "8am to 11pm"
                ]
            }
        ]
        res.render('about-us',{
            'locations': locations
        })
    })
    
    app.get('/contact-us/:email?', function(req,res){
        res.render("contact-us",{
            'email': req.params.email
        })
    })
}


main();



app.listen(3000, function(){
    console.log("Server has started");
})
