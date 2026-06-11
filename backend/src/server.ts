import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "./config/database";

dotenv.config();

const port = process.env.PORT || 3000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor iniciado en puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar MongoDB", error);
    process.exit(1);
  });
