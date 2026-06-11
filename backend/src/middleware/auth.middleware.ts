// Archivo de middleware para autenticación y autorización, aquí se definen las funciones que se utilizan para proteger las rutas de la API y verificar que el usuario tiene los permisos necesarios para acceder a ellas
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user.model";

// definición de una interfaz personalizada para el objeto Request de Express, que incluye una propiedad opcional "user" de tipo IUser, esto permite acceder a la información del usuario autenticado en las rutas protegidas
export interface AuthRequest extends Request {
  user?: IUser;
}

// función middleware para autenticar al usuario, verifica que el token JWT enviado en la cabecera Authorization es válido y corresponde a un usuario existente en la base de datos, si el token es válido se agrega la información del usuario al objeto Request para que pueda ser utilizada en las rutas protegidas
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // extraer el token JWT de la cabecera Authorization, se espera que el formato sea "
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    // verificar el token JWT utilizando la clave secreta definida en las variables de entorno, si el token es válido se obtiene el payload que contiene la información del usuario, luego se busca el usuario en la base de datos utilizando el ID obtenido del payload, si el usuario existe se agrega al objeto Request para que pueda ser utilizado en las rutas protegidas, si el token es inválido o el usuario no existe se devuelve un error de autenticación
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "access_secret") as jwt.JwtPayload;
    // buscar el usuario en la base de datos utilizando el ID obtenido del payload, se asume que el payload contiene una propiedad "sub" que corresponde al ID del usuario, si el usuario no existe se devuelve un error de autenticación
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Usuario no autorizado" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalido" });
  }
};

// función middleware para autorizar al usuario, verifica que el usuario autenticado tiene uno de los roles permitidos para acceder a la ruta protegida, si el usuario no tiene el rol necesario se devuelve un error de acceso denegado, si el usuario tiene el rol permitido se llama a la función next() para continuar con la ejecución de la ruta protegida
export const authorize = (...roles: Array<"admin" | "user">) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};
