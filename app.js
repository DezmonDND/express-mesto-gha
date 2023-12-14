const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes/index');
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

app.use(routes);
app.use(errors());
app.use('*', (req, res, next) => {
    next(new NotFoundError('Такого пути не существует.'));
});
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message })
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})