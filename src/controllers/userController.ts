import { Request, Response } from "express";
import { query } from "../config/database";

// 1. Get User Profile by ID
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Fetch user information but omit the password hash for safety
        const { rows } = await query("SELECT id, email FROM users WHERE id = $1", [id]);
        
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching profile" });
    }
};

// 2. Update User Profile (e.g., updating email)
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required to update profile" });
        }

        const { rows } = await query(
            "UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email",
            [email, id]
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
