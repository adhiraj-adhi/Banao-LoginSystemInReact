import { Router } from "express";
const router = Router();

import {CreateUser, LoginUser, ForgotPassword, ChangePassword} from "../controllers/entryController.js";

router.post("/register", CreateUser);
router.post("/login", LoginUser);
router.post("/forgotPassword", ForgotPassword);
router.post("/changePassword", ChangePassword);

export default router;