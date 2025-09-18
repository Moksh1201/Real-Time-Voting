import { prisma } from "./prismaClient.js";
let io;// socket.io instance for real-time communication 


export const initSockets = (serverIO) => {

  io = serverIO;   // this will help us assign the passed io instance to the module-level variable

  io.on("connection", (socket) => {// when a client connects 
    console.log("Client connected");

    socket.on("joinPoll", (pollId) => {// join a specific poll room for real-time updates
      socket.join(`poll_${pollId}`);
    });

    socket.on("leavePoll", (pollId) => {// leave the poll room when no longer needed 
      socket.leave(`poll_${pollId}`);
    });
  });
};

export const broadcastVoteUpdate = async (pollId) => { // this will broadcast the updated poll data to all clients in the poll room
  if (!io) return; // if io is not initialized, exit the function

  // Fetch the latest poll data including options and their votes from the database
  const poll = await prisma.poll.findUnique({ // find the poll by its id
    where: { id: pollId },
    include: {
      options: {
        include: {
          votes: true// include votes for each option 
        }
      }
    }
  });

  io.to(`poll_${pollId}`).emit("pollUpdate", poll);// emit the updated poll data to all clients in the specific poll room
};
