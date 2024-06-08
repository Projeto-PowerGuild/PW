process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const options = require("./config/settings.json").database;

const app = express();

const sessionStore = new MySQLStore(options);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
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

const trendingGame = {
  id: 58720,
  name: "Ghost of Tsushima",
  description: "A beautiful open-world action-adventure game set in feudal Japan.",
  price: 59.99,
  discount: 20,
  releaseDate: "2020-07-17",
  genre: "Action, Adventure",
  image: "https://media.rawg.io/media/resize/1280/-/games/193/193c9fe23ca026914fdf41d551ff3df9.jpg"
};

app.get('/api/trending', async (req, res) => {
  try {
      res.json(trendingGame);
  } catch (error) {
      console.error('Error fetching the trending game:', error.message, error.stack);
      res.status(502).send('Bad Gateway');
  }
});

app.get('/api/products', async (req, res) => {
  const rawgUrl = 'https://api.rawg.io/api/games';
  const apiKey = 'af44d7146ee947279a58c62db9ff347e';

  try {
    const response = await fetch(`${rawgUrl}?key=${apiKey}&page_size=12`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const rawgUrl = `https://api.rawg.io/api/games/${id}`;
  const apiKey = 'af44d7146ee947279a58c62db9ff347e';

  try {
    const response = await fetch(`${rawgUrl}?key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/shop', async (req, res) => {
  const { id } = req.params;
  const rawgUrl = `https://api.rawg.io/api/games/${id}`;
  const apiKey = 'af44d7146ee947279a58c62db9ff347e';

  try {
    const response = await fetch(`${rawgUrl}?key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});