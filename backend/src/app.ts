// Archivo principal de la aplicación, aquí se configuran los middlewares y las rutas principales
import cors from "cors";
import express from "express";
import routes from "./routes";

const app = express();

// configuración de middlewares, se utiliza cors para permitir peticiones desde el frontend y express.json para parsear el cuerpo de las peticiones como JSON
app.use(cors());
app.use(express.json());

// ruta de prueba para verificar que la API esta funcionando, devuelve un mensaje simple en formato JSON
app.get("/", (_req, res) => {
  res.json({
    message: "API funcionando"
  });
});

app.use("/v1", routes);

export default app;
