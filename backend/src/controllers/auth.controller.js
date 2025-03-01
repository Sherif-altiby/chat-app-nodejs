import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { validationResult } from 'express-validator';
import { generateToken } from "../lib/generateToken.js";
import cloudinary from "../lib/cloudinary.js";


export const register = async (req, res) => {
   try {
    const { username, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: errors.array(),
            success: false,
        });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ 
        message: "User already exists",
        success: false,
     });
    }   

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
        username, 
        email, 
        password: hashedPassword 
    });
    await newUser.save();

    generateToken(res, newUser._id);

    res.status(201).json({ 
        message: "User created successfully",
        success: true,
        data: newUser
    });

   } catch (error) {
        res.status(500).json({ message: error.message });
   }
};

export const login = async (req, res) => {
  
    try {
        const { email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array(),
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: "User not found", 
                success: false 
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                message: "Invalid password", 
                success: false 
            });   
        }

        generateToken(res, user._id);
        res.status(200).json({ 
            message: "Login successful", 
            success: true, 
            data: user 
        });

    } catch (error) {
        res.status(500).json({ 
            message: error.message ,
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { 
            maxAge: 0 
        });

        res.status(200).json({ 
            message: "Logout successful", 
            success: true 
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const updateProfileAvatar = async (req, res) => {
    try {
        const userId = req.user._id;

        if(!req.file) {
            return res.status(400).json({ 
                message: "Avatar is required", 
                success: false 
            });
        }   

        cloudinary.uploader.upload_stream({ resource_type: "image" }, async (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Upload failed", success: false });
            }

            const user = await User.findByIdAndUpdate(userId, { avatar: result.secure_url }, { new: true });

            return res.status(200).json({ 
                message: "Avatar updated successfully", 
                success: true, 
                data: user 
            });

        }).end(req.file.buffer);
         
    } catch (error) {
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
}


export const checkAuth = async (req, res) => {
    try {
        
        res.status(200).json({
            message: "User is authenticated",
            success: true,
            data: req.user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}
