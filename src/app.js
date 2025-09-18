import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import pollRoutes from "./routes/poll.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

app.use(errorHandler);

export default app;
