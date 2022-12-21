const express = require('express');
const hbs = require('hbs'); // for wax-on
const wax = require('wax-on'); // for template inheritance
const app =  express();

// initialise the view engine
app.set('view engine', 'hbs')

// initialise wax-on (after we create the `app`)
wax.on(hbs.handlebars); // set up wax-on
wax.setLayoutPath('./views/layouts'); // where to find layouts

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

app.get('/', function(req,res){
    res.render('home')
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


app.listen(3000, function(){
    console.log("Server has started");
})
