// import prisma from "../lib/prisma.js";
// import bcrypt from "bcrypt";

// export const getUsers = async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.status(200).json(users);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get users!" });
//   }
// };

// export const getUser = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id },
//     });
//     res.status(200).json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get user!" });
//   }
// };

// export const updateUser = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;
//   const { password, avatar, ...inputs } = req.body;

//   if (id !== tokenUserId) {
//     return res.status(403).json({ message: "Not Authorized!" });
//   }

//   let updatedPassword = null;
//   try {
//     if (password) {
//       updatedPassword = await bcrypt.hash(password, 10);
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         ...inputs,
//         ...(updatedPassword && { password: updatedPassword }),
//         ...(avatar && { avatar }),
//       },
//     });

//     const { password: userPassword, ...rest } = updatedUser;

//     res.status(200).json(rest);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to update users!" });
//   }
// };

// export const deleteUser = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;

//   if (id !== tokenUserId) {
//     return res.status(403).json({ message: "Not Authorized!" });
//   }

//   try {
//     await prisma.user.delete({
//       where: { id },
//     });
//     res.status(200).json({ message: "User deleted" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to delete users!" });
//   }
// };

// export const savePost = async (req, res) => {
//   const postId = req.body.postId;
//   const tokenUserId = req.userId;

//   try {
//     const savedPost = await prisma.savedPost.findUnique({
//       where: {
//         userId_postId: {
//           userId: tokenUserId,
//           postId,
//         },
//       },
//     });

//     if (savedPost) {
//       await prisma.savedPost.delete({
//         where: {
//           id: savedPost.id,
//         },
//       });
//       res.status(200).json({ message: "Post removed from saved list" });
//     } else {
//       await prisma.savedPost.create({
//         data: {
//           userId: tokenUserId,
//           postId,
//         },
//       });
//       res.status(200).json({ message: "Post saved" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to delete users!" });
//   }
// };

// export const profilePosts = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const userPosts = await prisma.post.findMany({
//       where: { userId: tokenUserId },
//     });
//     const saved = await prisma.savedPost.findMany({
//       where: { userId: tokenUserId },
//       include: {
//         post: true,
//       },
//     });

//     const savedPosts = saved.map((item) => item.post);
//     res.status(200).json({ userPosts, savedPosts });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get profile posts!" });
//   }
// };

// export const getNotificationNumber = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const number = await prisma.chat.count({
//       where: {
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//         NOT: {
//           seenBy: {
//             hasSome: [tokenUserId],
//           },
//         },
//       },
//     });
//     res.status(200).json(number);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get profile posts!" });
//   }
// };

import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

// Get a single user by ID
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  // Check if the user is authorized to update
  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  // Check if the user is authorized to delete
  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};

// Save or remove a post from the saved list
export const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      // Remove from saved posts
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      // Save the post
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save/remove post!" });
  }
};

// Get user's posts and saved posts
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

    const savedPostsData = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: { post: true },
    });

    const savedPosts = savedPostsData.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

// Get the number of unread notifications (chats)
export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const unreadCount = await prisma.chat.count({
      where: {
        userIDs: { hasSome: [tokenUserId] },
        NOT: { seenBy: { hasSome: [tokenUserId] } },
      },
    });
    res.status(200).json(unreadCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get notification count!" });
  }
};

