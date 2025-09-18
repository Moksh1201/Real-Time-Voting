import { Router } from "express";
import { createUser, getUsers, getUserById } from "../controllers/user.controller.js";
import { validateCreateUser, validateIdParam } from "../middlewares/validation.js";

const router = Router(); 
router.post("/", validateCreateUser, createUser);// to create a new user with validation tand check is use exist with validation check
router.get("/", getUsers);// get all the users
router.get("/:id", validateIdParam("id"), getUserById);// get a single user by its id with validation to check the id parameter

export default router;
