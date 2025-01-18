import prisma from "../lib/prisma.js";

// Add a new message to a chat
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const { chatId } = req.params;
  const { text } = req.body;

  // Validate input
  if (!text || !chatId) {
    return res.status(400).json({ message: "Message text and chat ID are required" });
  }

  try {
    // Check if the chat exists and the user is part of it
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Create the new message
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // Update the chat with the last message and mark it as seen by the current user
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          push: tokenUserId, // Add the current user to the "seenBy" array
        },
        lastMessage: text,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
