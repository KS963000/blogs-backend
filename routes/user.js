const userRouter = require("express").Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt=require("jsonwebtoken")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userValidationRules = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

userRouter.post("/signup", userValidationRules, validate, async (req, res) => {
    const { email, ...otherData } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(otherData.password, saltRounds);
        const newUser = await prisma.user.create({
            data: { email, ...otherData, password: hashedPassword }
        });

        const token = jwt.sign(
            { id: newUser.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }    
        );

        res.status(200).json({ message: "User added successfully", newUser, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while adding new user" });
    }
});

userRouter.post("/signin", userValidationRules, validate, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }    
        );

        res.status(200).json({ message: "Authentication successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred during sign in" });
    }
});

userRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = userRouter