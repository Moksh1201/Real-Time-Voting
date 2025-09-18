import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import pollRoutes from "./routes/poll.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
// Middleware to parse JSON request bodies
app.use("/api/users", userRoutes);
// Routes for user-related operations
app.use("/api/polls", pollRoutes);
// Routes for poll-related operations
app.use("/api/votes", voteRoutes);

app.use(errorHandler);

export default app;
