import express from "express";
const router = express.Router();

const { uploadFile } = require('../middleware/multer');

const user_controller = require("../controllers/user.controller");
var uploadMultiple = uploadFile.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }])

// creare new user
router.post("/user", uploadFile.single('profilePicture'), user_controller.user_create);

// get user based on role
router.get("/user/:id", user_controller.get_user_by_role);

// get user by email
router.get("/email", user_controller.get_user_by_email);

// update user by id

router.patch("/user_update/:id", uploadMultiple, user_controller.update_user);

router.post("/gmailauthenticate", user_controller.gmail_authenticate);
router.post("/fbauthenticate", user_controller.fb_authenticate);

router.post("/user/login", user_controller.user_login);
router.post("/state", user_controller.state);

router.get("/states", user_controller.findAllStates);
router.get("/getUserDetails/:id", user_controller.userDetails);

router.post("/req_reset_password", user_controller.ResetPassword);
router.post('/new-password', user_controller.NewPassword);
router.post('/valid-password-token', user_controller.ValidPasswordToken);

router.get("/findAllAtheletes", user_controller.findAllAtheletes);
router.get("/finduserData/:id", user_controller.finduserData);
router.patch("/update_users/:id", user_controller.update_users);
router.patch("/update_users_password/:id", uploadMultiple, user_controller.update_users_password)

export { router as UserRoutes };
