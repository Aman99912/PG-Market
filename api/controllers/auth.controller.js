import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Register a new user
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email is valid
    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save the new user to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // console.log("New user created:", newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    // console.error("Error creating user:", err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

// Log in a user
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Generate JWT token
    const tokenExpiration = 1000 * 60 * 60 * 24 * 7; // 7 days
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin, // Assuming isAdmin is a field in the user model
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: tokenExpiration }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true, // Uncomment if using HTTPS
        maxAge: tokenExpiration,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    // console.error("Error logging in:", err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

// Log out a user
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};
