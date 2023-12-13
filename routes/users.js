const router = require('express').Router();
const { getUsers, getOneUser, updateAvatar, updateUsersData, getUsersMe } = require('../controllers/users');
const { updateAvatarValidation, userDataValidation, getOneUserValidation } = require('../middlewares/validationJoi');

router.get('/', getUsers);
router.get('/me', getUsersMe);
router.get('/:userId', getOneUserValidation, getOneUser);
router.patch('/me', userDataValidation, updateUsersData);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;