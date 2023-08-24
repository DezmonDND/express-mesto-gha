const router = require('express').Router();
const User = require('../models/user');
const { createUser, getUsers, getOneUser } = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/', getOneUser);

module.exports = router;