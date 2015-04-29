// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://localhost/mortalitydb');

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    var CauseOfDeathSchema = new mongoose.Schema({
        state: String,
        abbreviation: String,
        cause_of_death: String,
        cause_of_death_code: String,
        age_group: String,
        age_group_code: String,
        gender: String,
        gender_code: String,
        deaths: Number,
        population: Number,
        crude_rate: Number
    },
    {
        collection: 'causes_of_death'
    });

    var CauseOfDeath = mongoose.model('CauseOfDeath', CauseOfDeathSchema);


    // routes ======================================================================

     app.get('/search/:search/:gender/:state/:age_group', function(req, res){
        var gender = req.params.gender;
        var regexp = new RegExp(req.params.search);
        var state = req.params.state;
        var age_group = req.params.age_group;
        //console.log("============================ " + req.params.search + " - " + gender + " - " + state + " - " + age_group + " =============================");

        var query = CauseOfDeath.find({cause_of_death: regexp, gender: gender, state: state, age_group: age_group}).sort({deaths: -1}).limit(1);
        query.exec(function(err, cause_of_death) {
            if (err) {res.send(err);}
            res.json(cause_of_death[0]);
        });
    });
    
    app.get('/causes_of_death/:state', function(req, res) {
        var state = req.params.state;
        console.log("============================" + state.toUpperCase() + "=============================");
        var query = CauseOfDeath.find({state: state}).sort({deaths: -1}).limit(1);
        query.exec(function(err, cause_of_death) {
            if (err) {res.send(err);}
            res.json(cause_of_death[0]);
        });
    });


    // application =================================================================
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file
    });


    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
