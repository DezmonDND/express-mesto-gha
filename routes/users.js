const router = require('express').Router();
const { createUser, getUsers, getOneUser, updateAvatar, updateUsersData } = require('../controllers/users');

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:userId', getOneUser);

router.patch('/me', updateUsersData);

router.patch('/me/avatar', updateAvatar);

module.exports = router;