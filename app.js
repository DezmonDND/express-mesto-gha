const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.user = {
        _id: '64e77b5a048f3b10f4f97d0b'
    };

    next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*', (req, res, next) => {
    res.status(404).send({ message: '404 — Такого пути не существует.' });
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})