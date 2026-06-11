// controlador para manejar las solicitudes relacionadas con el panel de control
import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getDashboard } from "./dashboard.service";

// funcion para mostrar el panel de control
export const showDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const dashboard = await getDashboard(req.user!._id.toString(), req.query.month as string | undefined);

    res.json(dashboard);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
