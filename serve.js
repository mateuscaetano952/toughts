require( 'dotenv' ).config ( )
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
const conn = require('./src/db/conn');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

//Models
const Tought = require('./src/models/Tought');
const User = require('./src/models/User');

//handlebars setup
const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//Flash messages middleware
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Session middleware
app.use(session({
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new FileStore(),
  path: path.join(require('os').tmpdir(), 'sessions'),
  cookie: {
    secure:false,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    httppOnly: true
  }
}));



//Set session to res
app.use((req, res, next) => {
  
  if(req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

//routes
app.use('/', routes);

//server connection
const PORT = process.env.PORT || 3000;
conn
//.sync({force: true})
.sync()
.then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}).catch((err) => {
  console.error('Failed to connect to the database:', err);
});