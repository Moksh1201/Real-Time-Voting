import { prisma } from "./prismaClient.js";

let io;

export const initSockets = (serverIO) => {
  io = serverIO;

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("joinPoll", (pollId) => {
      socket.join(`poll_${pollId}`);
    });

    socket.on("leavePoll", (pollId) => {
      socket.leave(`poll_${pollId}`);
    });
  });
};

export const broadcastVoteUpdate = async (pollId) => {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: {
          votes: true
        }
      }
    }
  });

  io.to(`poll_${pollId}`).emit("pollUpdate", poll);
};
