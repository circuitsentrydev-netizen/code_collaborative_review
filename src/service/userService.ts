import { query } from "../config/database";
import bcrypt from "bcryptjs";
import { User } from "../types/user.types";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const {rows} =await query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
}; 

export const createUser = async (email: string, password: string): Promise<User> => {
    // 1. Hash the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Insert the user and return the newly created record (* returns all columns including id)
    const { rows } = await query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
        [email, hashedPassword]
    );

    return rows[0];
};

