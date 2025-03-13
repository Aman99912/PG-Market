import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// ✅ Get all posts with filtering
export const getPosts = async (req, res) => {
  try {
    const { city, type, property, bedroom, minPrice, maxPrice } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        city: city || undefined,
        type: type || undefined,
        property: property || undefined,
        bedroom: bedroom ? parseInt(bedroom) : undefined,
        price: {
          gte: minPrice ? parseInt(minPrice) : undefined,
          lte: maxPrice ? parseInt(maxPrice) : undefined,
        },
      },
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).json({ message: "Failed to get posts" });
  }
};

// ✅ Get a single post by ID
export const getPost = async (req, res) => {
  const { id } = req.params;
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

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        return res.status(200).json({ ...post, isSaved: !!saved });
      } catch (err) {
        console.error("JWT Verification Error:", err);
        return res.status(403).json({ message: "Invalid token" });
      }
    }

    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.error("Error fetching post:", err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};

// ✅ Add a new post
export const addPost = async (req, res) => {
  try {
    const { postData, postDetail } = req.body;
    const tokenUserId = req.userId;

    if (!postData || !postDetail) {
      return res.status(400).json({ message: "Missing post data or details" });
    }

    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });

    return res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ message: "Failed to create post" });
  }
};

// ✅ Update an existing post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!updateData) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(500).json({ message: "Failed to update post" });
  }
};

// ✅ Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({ where: { id } });

    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
