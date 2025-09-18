import { prisma } from "../prismaClient.js";

export const validateIdParam = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: `Invalid ${paramName}` });
  }
  next();
};

export const validateCreateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Valid email required" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const validateCreatePoll = async (req, res, next) => {
  try {
    const { question, creatorId, options } = req.body || {};
    if (typeof question !== "string" || question.trim().length < 5) {
      return res.status(400).json({ message: "Question must be at least 5 characters" });
    }
    if (!Number.isInteger(creatorId) || creatorId <= 0) {
      return res.status(400).json({ message: "Valid creatorId required" });
    }
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "At least two options are required" });
    }
    const normalized = options.map(o => (typeof o === "string" ? o.trim() : ""));
    if (normalized.some(t => t.length === 0)) {
      return res.status(400).json({ message: "Options must be non-empty strings" });
    }
    const uniqueCount = new Set(normalized.map(t => t.toLowerCase())).size;
    if (uniqueCount !== normalized.length) {
      return res.status(400).json({ message: "Options must be unique" });
    }
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const validateCastVote = async (req, res, next) => {
  try {
    const { userId, pollOptionId } = req.body || {};
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Valid userId required" });
    }
    if (!Number.isInteger(pollOptionId) || pollOptionId <= 0) {
      return res.status(400).json({ message: "Valid pollOptionId required" });
    }
    const [user, option] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.pollOption.findUnique({ where: { id: pollOptionId }, include: { poll: true } }),
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!option) return res.status(404).json({ message: "Poll option not found" });
    next();
  } catch (err) {
    next(err);
  }
};


