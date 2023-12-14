const usersRouter = require('express').Router();
const { getUsers, getOneUser, updateAvatar, updateUsersData, getUsersMe } = require('../controllers/users');
const { updateAvatarValidation, userDataValidation, getOneUserValidation } = require('../middlewares/validationJoi');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUsersMe);
usersRouter.get('/:userId', getOneUserValidation, getOneUser);
usersRouter.patch('/me', userDataValidation, updateUsersData);
usersRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = usersRouter;