import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User Registration
export const registerUser = async (req, res) =>{
    const{username, password} = req.body;
    try{
        const exsistingUser = await prisma.user.findUnique({where:{username}});
        if(existingUser){
            return res.status(400).json({message: 'Username already exists'});
            
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser  = await prisma.user.create({
            data:{username,password:hashedPassword}
        });
        res.status(201).json({message: 'User registered successfully', userId: newUser.id});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}
// User Login
export const LoginUser = async (req, res)=>{
    const {username,password} = req.body;
    try{
        const user = await prisma.user.findUnique({where:{username}});
        if(!user){
            return res.status(400).json({message: 'Invalid username or password'});
        } 
        const isPasswordVliad = await bcrypt.compare(password,user.password);
        if(!isPasswordVliad){
            return res.status(400).json({message: 'Invalid username or password'});
        }
        const token = jwt.sign({userId: user.id, username:user.username}, JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: 'Login successful', token});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// Get User Profile
export const getUserProfile = async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });

        }
        res.status(200).json({ message: 'User profile retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

