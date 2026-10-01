import { Request, Response } from 'express';
import { query } from '../config/database';
import bcrypt from 'bcryptjs';


// 4. Register a New User
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Validation: Ensure email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user already exists
        const existingUser = await query("SELECT id FROM users WHERE email = $1", [email]);
        if (existingUser.rows && existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash the password safely (Salt rounds = 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        const { rows } = await query(
            "INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role",
            [email, hashedPassword, name || null, 'user'] // defaults role to 'user'
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error); // Helpful for tracking database errors in console
        return res.status(500).json({ message: "Error registering new user" });
    }
};


// 1. Get User Profile by ID

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rows } = await query("SELECT id, email, name, display_picture, role FROM users WHERE id = $1", [id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching profile" });
    }
};

// 2. Update User Profile
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, name, display_picture } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required to update profile" });
        }

        const { rows } = await query(
            "UPDATE users SET email = $1, name = $2, display_picture = $3 WHERE id = $4 RETURNING id, email, name, display_picture",
            [email, name || null, display_picture || null, id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile updated successfully", user: rows[0] });
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile" });
    }
};

// 3. Delete User Profile
export const deleteUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rows } = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User profile deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting profile" });
    }
};
