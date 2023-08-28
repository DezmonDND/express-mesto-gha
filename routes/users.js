const router = require('express').Router();
const { createUser, getUsers, getOneUser, updateAvatar, updateUsersData } = require('../controllers/users');

router.post('/users', createUser);

router.get('/users', getUsers);

router.get('/users/:userId', getOneUser);

router.patch('/users/me', updateUsersData);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;