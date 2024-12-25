import jwt from "jsonwebtoken";
import { TokenType } from "../types";
import { v4 as uuid } from "uuid";

export { uuid };

export const generateToken = (
  userId: string,
  type: TokenType,
  secret: string
) => {
  const expiresIn = type === "access" ? "10m" : "7d";

  return jwt.sign({ userId, type }, secret, {
    expiresIn,
  });
};
