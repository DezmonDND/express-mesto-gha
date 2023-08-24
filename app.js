const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', router);

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

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})