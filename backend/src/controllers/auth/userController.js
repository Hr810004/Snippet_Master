import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../../models/auth/Token.js";
import crypto from "node:crypto";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";
import { deleteOldProfileImage } from "../../helpers/cloudinaryHelper.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // bad request
    return res.status(400).json({ message: "User already exists" });
  }

  // create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // generate token with user id
  const token = generateToken(user._id);

  // send back the user and token in the response to the client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "none", // cross-site access --> allow all third-party cookies
    secure: true,
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;

    // 201 Created
    res.status(201).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// user login
export const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found, sign up!" });
  }

  // check id the password match the hashed password in the database
  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    // 400 Bad Request
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // generate token with user id
  const token = generateToken(userExists._id);

  if (userExists && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = userExists;

    // set the token in the cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "none", // cross-site access --> allow all third-party cookies
      secure: true,
    });

    // send back the user and token in the response to the client
    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "User logged out" });
});

// get user
export const getUser = asyncHandler(async (req, res) => {
  // get user details from the token ----> exclude password
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    // 404 Not Found
    return res.status(404).json({ message: "User not found" });
  }
});

// get user by Id
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password, -email");

    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error getting user by Id", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
  try {
    console.log("Update user request received:", {
      userId: req.user._id,
      hasFile: !!req.file,
      bodyFields: Object.keys(req.body)
    });

    // get user details from the token ----> protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("User not found:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found, updating properties...");

    // update user properties
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.github = req.body.github || user.github;
    user.linkedin = req.body.linkedin || user.linkedin;
    user.publicEmail = req.body.publicEmail || user.publicEmail;
    
    // Handle email update with validation
    if (req.body.email && req.body.email !== user.email) {
      // Check if the new email is already taken by another user
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email is already taken by another user" });
      }
      user.email = req.body.email;
      // Reset email verification status when email is changed
      user.isVerified = false;
    }

    // Handle file upload for photo
    if (req.file) {
      try {
        console.log("Processing file upload:", req.file.originalname);
        console.log("File details:", {
          fieldname: req.file.fieldname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path
        });
        
        // Delete old profile image if it exists
        if (user.photo && !user.photo.includes('avatars.githubusercontent.com')) {
          console.log("Deleting old profile image:", user.photo);
          await deleteOldProfileImage(user.photo);
        }
        
        // Cloudinary upload successful - use the secure URL
        user.photo = req.file.path;
        console.log("Profile photo uploaded to Cloudinary:", req.file.path);
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        console.error("Cloudinary error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ message: "Failed to upload image: " + error.message });
      }
    } else if (req.body.photo && req.body.photo !== user.photo && req.body.photo !== '') {
      // If photo URL is provided in body and it's different from current and not empty
      console.log("Updating photo URL:", req.body.photo);
      user.photo = req.body.photo;
    } else {
      console.log("No photo update needed, keeping existing photo");
    }

    console.log("Saving updated user...");
    const updated = await user.save();
    console.log("User saved successfully");

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      photo: updated.photo,
      bio: updated.bio,
      isVerified: updated.isVerified,
      publicEmail: updated.publicEmail,
      github: updated.github,
      linkedin: updated.linkedin,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    
    // Check for specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate field value", 
        error: "A user with this information already exists"
      });
    }
    
    return res.status(500).json({ 
      message: "Failed to update profile", 
      error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
    });
  }
});

// login status
export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // 401 Unauthorized
    return res.status(401).json({ message: "Not authorized, please login!" });
  }
  
  try {
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      res.status(200).json(true);
    } else {
      return res.status(401).json(false);
    }
  } catch (error) {
    console.log("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
});

// email verification
export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // if user exists
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // check if user is already verified
  if (user.isVerified) {
    return res.status(400).json({ message: "User is already verified" });
  }

  let token = await Token.findOne({ userId: user._id });

  // if token exists --> delete the token
  if (token) {
    await token.deleteOne();
  }

  // create a verification token using the user id --->
  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

  // hast the verification token
  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }).save();

  // verification link
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // send email
  const subject = "Email Verification - AuthKit";
  const send_to = user.email;
  const reply_to = "noreply@gmail.com";
  const template = "emailVerification";
  const send_from = process.env.USER_EMAIL;
  const name = user.name;
  const url = verificationLink;

  try {
    // order matters ---> subject, send_to, send_from, reply_to, template, name, url
    await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    return res.json({ message: "Email sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "Email could not be sent" });
  }
});

// verify user
export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid verification token" });
  }
  // hash the verification token --> because it was hashed before saving
  const hashedToken = hashToken(verificationToken);

  // find user with the verification token
  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    // check if the token has not expired
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token" });
  }

  //find user with the user id in the token
  const user = await User.findById(userToken.userId);

  if (user.isVerified) {
    // 400 Bad Request
    return res.status(400).json({ message: "User is already verified" });
  }

  // update user to verified
  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: "User verified" });
});

// forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    // 404 Not Found
    return res.status(404).json({ message: "User not found" });
  }

  // see if reset token exists
  let token = await Token.findOne({ userId: user._id });

  // if token exists --> delete the token
  if (token) {
    await token.deleteOne();
  }

  // create a reset token using the user id ---> expires in 1 hour
  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

  // hash the reset token
  const hashedToken = hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  }).save();

  // reset link
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

  // send email to user
  const subject = "Password Reset - AuthKit";
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL;
  const reply_to = "noreply@noreply.com";
  const template = "forgotPassword";
  const name = user.name;
  const url = resetLink;

  try {
    await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    res.json({ message: "Email sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "Email could not be sent" });
  }
});

// reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // hash the reset token
  const hashedToken = hashToken(resetPasswordToken);

  // check if token exists and has not expired
  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    // check if the token has not expired
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // find user with the user id in the token
  const user = await User.findById(userToken.userId);

  // update user password
  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

// change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //find user by id
  const user = await User.findById(req.user._id);

  // compare current password with the hashed password in the database
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  // reset password
  if (isMatch) {
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } else {
    return res.status(400).json({ message: "Password could not be changed!" });
  }
});
