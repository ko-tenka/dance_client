require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const apiRouter = require('./routes/apiRouter');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3001;

const sessionConfig = {
  name: 'reactCookies',
  store: new FileStore(),
  secret: process.env.SESSION_SECRET ?? 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 1000 * 60 * 60,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
