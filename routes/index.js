const routes = require('express').Router();
const cardsRouter = require("./cards");
const usersRouter = require("./users");
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { loginValidation, createUserValidation } = require('../middlewares/validationJoi');
const app = express();

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

module.exports = routes;
