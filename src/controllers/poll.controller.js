import { prisma } from "../prismaClient.js";

export const createPoll = async (req, res, next) => {
  try {
    const { question, creatorId, options } = req.body;

    const poll = await prisma.poll.create({
      data: {
        question,
        creatorId,
        isPublished: true,
        options: {
          create: options.map(text => ({ text }))
        }
      },
      include: { options: true }
    });

    res.status(201).json(poll);
  } catch (err) {
    next(err);
  }
};

export const getPolls = async (req, res, next) => {
  try {
    const polls = await prisma.poll.findMany({ include: { options: true } });
    res.json(polls);
  } catch (err) {
    next(err);
  }
};

export const getPollById = async (req, res, next) => {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { options: { include: { votes: true } } }
    });
    res.json(poll);
  } catch (err) {
    next(err);
  }
};
