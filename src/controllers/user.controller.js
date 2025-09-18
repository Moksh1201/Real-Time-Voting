import bcrypt from "bcrypt";
import { prisma } from "../prismaClient.js";

//It here to create a new user
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

//This is to get all the users

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { id: "asc" },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};
//This to get single user by its id
export const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

