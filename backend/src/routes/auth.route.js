import express from "express";
import { login, logout, signup ,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";



const router = express.Router();

router.post("/signup",signup);
router.post("/login", login);
router.post("/logout",logout);
router.put("/update-profile",protectRoute ,updateProfile); //1. protectRoute is a middleware to protect the route so that only authenticated users can access it and update their profile
router.get("/check",protectRoute,checkAuth); //1. checkAuth is a middleware to check if the user is authenticated or not , this function will be called when user refreshes the page or reloads the app to check if the user is authenticated or not


export default router;

/*
1. 
we would like to call this file during sign up and login and logout
we will use this file to handle authentication related routes
*/
