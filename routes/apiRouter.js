const router = require('express').Router();
const userRouter = require('./userRouter');
const taskRouter = require('./taskRouter');
const imgRouter = require('./imgRouter')


router.use('/users', userRouter);
router.use('/task', taskRouter);
router.use('/img', imgRouter);

module.exports = router;