const express = require('express'); //importing express
var router = express.Router();
const userController = require('../controllers/userController')



router.route('/addUser')
.post(userController.addUser)//to add user

router.route('/login')
.post(userController.login)



module.exports = router;
