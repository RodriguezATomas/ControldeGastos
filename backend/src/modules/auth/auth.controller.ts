import { Request, Response } from "express";
import {
  forgotUserPassword,
  loginUser,
  logoutUser,
  refreshUserTokens,
  registerUser,
  resetUserPassword,
  sendUserVerificationEmail,
  verifyUserEmail
} from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const data = await registerUser(name, email, password);

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);

    res.json(data);
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    await logoutUser(refreshToken);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshUserTokens(refreshToken);

    res.json({ tokens });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const data = await forgotUserPassword(email);

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    await resetUserPassword(token, password);
    res.json({ message: "Password actualizado" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const data = await sendUserVerificationEmail(email);

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    await verifyUserEmail(token);
    res.json({ message: "Email verificado" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
