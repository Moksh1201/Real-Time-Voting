import { Router } from "express";
import { castVote } from "../controllers/vote.controller.js";
import { validateCastVote } from "../middlewares/validation.js";

const router = Router();
router.post("/", validateCastVote, castVote);// to cast a vote with validation to check the input

export default router;
