// Archivo de rutas para la autenticacion
import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshTokens,
  register,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
} from "./auth.controller";

const router = Router();

// Definir las rutas de autenticacion y asociarlas con sus controladores correspondientes

// ruta para registrar un nuevo usuario, se espera un body con name, email y password
router.post("/register", register); 
// ruta para iniciar sesion, se espera un body con email y password
router.post("/login", login);
// ruta para cerrar sesion, se espera un body con el refreshToken del usuario
router.post("/logout", logout);
// ruta para actualizar los tokens de usuario
router.post("/refresh-tokens", refreshTokens);
// ruta para solicitar un cambio de password
router.post("/forgot-password", forgotPassword);
// ruta para resetear el password del usuario
router.post("/reset-password", resetPassword);
// ruta para enviar un email de verificacion al usuario
router.post("/send-verification-email", sendVerificationEmail);
// ruta para verificar el email del usuario
router.post("/verify-email", verifyEmail);

export default router;
