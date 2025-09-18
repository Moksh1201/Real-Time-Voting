import { Router } from "express";
import { castVote } from "../controllers/vote.controller.js";

const router = Router();
router.post("/", castVote);

export default router;
