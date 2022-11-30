const router = require('express').Router();
const {getUsers, getUser, createUser} = require('../controllers');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);

module.exports = router;