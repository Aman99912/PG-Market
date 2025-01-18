import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    return res.status(200).json(posts);  // Ensure only one response
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get posts" });  // Ensure only one response
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ message: "Token is not Valid!" });

        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        return res.status(200).json({ ...post, isSaved: saved ? true : false });  // Ensure only one response and return after sending response
      });
    }

    return res.status(200).json({ ...post, isSaved: false });  // Ensure only one response and return after sending response
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get post" });  // Ensure only one response
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    return res.status(200).json(newPost);  // Ensure only one response
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to create post" });  // Ensure only one response
  }
};

export const updatePost = async (req, res) => {
  try {
    // Add your update logic here
    return res.status(200).json({ message: "Post updated" });  // Ensure only one response
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to update posts" });  // Ensure only one response
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Post deleted" });  // Ensure only one response
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete post" });  // Ensure only one response
  }
};
