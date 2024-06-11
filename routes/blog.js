const router = require("express").Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken= require("./middleware")
const { body, validationResult } = require('express-validator');

const blogValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
];

const validateBlog = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post("/", authenticateToken, blogValidationRules, validateBlog, async (req, res) => {
    try {
        const { title, content} = req.body; 
        const authorId = req.userId;

        const newBlog = await prisma.post.create({
            data: {
                title,
                content,
                published: false, 
                author: {
                    connect: { id: authorId } 
                }
            }
        });

        res.status(200).json({ message: "Blog added successfully", newBlog });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while adding the blog" });
    }
});


router.get("/", async (req, res) => {
    try {
        const blogs = await prisma.post.findMany();
        res.status(200).json({ blogs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while retrieving the blogs" });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await prisma.post.findUnique({
            where: { id: id }
        });
        res.status(200).json({ blog });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while retrieving the blog" });
    }
});

router.put("/:id", authenticateToken, blogValidationRules, validateBlog, async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const updatedBlog = await prisma.post.update({
            where: { id: id },
            data: data
        });
        res.status(200).json({ message: "Blog updated successfully", updatedBlog });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while updating the blog" });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.post.delete({
            where: { id: id }
        });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while deleting the blog" });
    }
});

module.exports = router;
