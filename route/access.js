var express = require("express");
var router = express.Router();
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

// controllers/index.js 안에 usersController 를 사용
const { accessController } = require("../controller");

router.post('/in', accessController.in.post);

router.post('/out', accessController.out.post);

router.get('/log', accessController.log.get);


module.exports = router;