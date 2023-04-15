const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8001;
const expresslayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// used for session cookies
const session = require('express-session')
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));


app.use(express.urlencoded());
app.use(cookieParser());



app.use(express.static('./assets'));
// makes the upload path visible
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expresslayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




//set up view engine 
app.set('view engine', 'ejs');
app.set('views', './views');


//mongo store is used to store the session cookies in the db
app.use(session({
    name: 'codeial',
    // todo chnage the secret before deployment in production node
    secret: 'blahsomthing',
    saveUninitialized: false,
    resave: false,
    cookies: {
        maxAge: (1000*60*100)
    },
   store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup done');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
