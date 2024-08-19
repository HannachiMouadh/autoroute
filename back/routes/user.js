const express = require("express");
const router = express.Router();
const controllers = require('../controllers/user');
const {loginRules,registerRules,validation} = require('../middleware/validator');
const isAuth = require('../middleware/passport');



// register
router.post("/register", registerRules(),validation,controllers.register);

// login 
router.post("/login", loginRules(),validation,controllers.login);

// current
router.get("/current",isAuth(),controllers.current);

// Update user route
router.put('/:id', controllers.update);


router.get("/",controllers.getAll);


router.delete("/:id",controllers.delete);

module.exports = router;