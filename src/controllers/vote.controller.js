import { prisma } from "../prismaClient.js";
import { broadcastVoteUpdate } from "../sockets.js";

// this will be used to cast a vote for a poll option
export const castVote = async (req, res, next) => {
  try {
    const { userId, pollOptionId } = req.body;

    const option = await prisma.pollOption.findUnique({
      where: { id: pollOptionId },
      include: { poll: true },
    });
    if (!option) return res.status(404).json({ message: "Poll option not found" });

    const existing = await prisma.vote.findFirst({
      where: {
        userId,
        pollOption: { pollId: option.pollId },
      },
      include: { pollOption: true },
    });
    if (existing) {
      return res.status(409).json({ message: "User has already voted in this poll" });
    }

    const vote = await prisma.vote.create({
      data: { userId, pollOptionId },
    });

    const pollOption = await prisma.pollOption.findUnique({
      where: { id: pollOptionId },
      include: { poll: true }
    });

    broadcastVoteUpdate(pollOption.pollId);

    res.status(201).json(vote);
  } catch (err) {
    next(err);
  }
};
