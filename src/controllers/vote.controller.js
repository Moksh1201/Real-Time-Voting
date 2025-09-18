import { prisma } from "../prismaClient.js";
import { broadcastVoteUpdate } from "../sockets.js";

export const castVote = async (req, res, next) => {
  try {
    const { userId, pollOptionId } = req.body;

    const vote = await prisma.vote.create({
      data: { userId, pollOptionId },
    });

    const pollOption = await prisma.pollOption.findUnique({
      where: { id: pollOptionId },
      include: { poll: true }
    });

    // broadcast updated results
    broadcastVoteUpdate(pollOption.pollId);

    res.status(201).json(vote);
  } catch (err) {
    next(err);
  }
};
