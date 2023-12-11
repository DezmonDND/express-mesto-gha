const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     req.user = {
//         _id: '64e77b5a048f3b10f4f97d0b'
//     };

//     next();
// });

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));
app.use('*', (req, res, next) => {
    res.status(404).send({ message: '404 — Такого пути не существует.' });
})
app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})