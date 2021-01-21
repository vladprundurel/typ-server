//importing modules
require('./config/config');
require('./config/passportConfig');
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
var app = express();
const route = require('./routes/route');
const chartRoutes = require('./routes/chartRoutes');
const passport = require('passport');

//connect to mongo database
mongoose.connect('mongodb+srv://vladprundurel:SsqWSkeRvOs172PR@cluster0-vhlqk.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', ()=>{
    console.log('Mongodb connected');
});

mongoose.connection.on('error', (err)=>{
    console.log('Error in connecting to database: ' + err);
});

//port numberc
const port = process.env.PORT || 4000;



//adding middleware to pass data from client to server
app.use(cors());

app.use((req, res, next) => {
    //res.append('Access-Control-Allow-Origin', ['*']);
   // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   // res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//body-parser
app.use(bodyparser.json());

app.use(passport.initialize());

//static files
var distDir = __dirname + "/client/";
app.use(express.static(distDir));
// app.use(express.static(path.join(__dirname, 'public')));


//routes
app.use('/api', route);
app.use('/api-charts', chartRoutes);

//testing server
app.get('/', (req, res)=>{
    res.render('index.html');
});

console.clear();

//error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});
app.listen(port, ()=>{
    console.log('Server running on port: ' + port);
})


