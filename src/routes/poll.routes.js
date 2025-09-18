import { Router } from "express";
import { createPoll, getPolls, getPollById } from "../controllers/poll.controller.js";
import { validateCreatePoll, validateIdParam } from "../middlewares/validation.js";

const router = Router(); // this is a default express router
router.post("/", validateCreatePoll, createPoll);// to create a new poll with validation to check the input
router.get("/", getPolls);// to get all the polls
router.get("/:id", validateIdParam("id"), getPollById);// to get a specific poll by its id with validation to check the id parameter

export default router;
