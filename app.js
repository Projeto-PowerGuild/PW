const express = require('express');
const path = require('path');
const session = require('express-session');
const platformsRouter = require('./routes/platformRoute'); 
const authRoutes = require('./routes/authRoute'); 
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const options = require("./config/settings.json").database;
const app = express();
const sessionStore = new MySQLStore(options);

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'www')));
app.use('/platforms', platformsRouter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  key: 'session_cookie_name',
  secret: 'your_secret_key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, 
      httpOnly: true,
      sameSite: 'lax' 
  }
}));

app.use('/auth', authRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


