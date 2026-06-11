"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
dotenv_1.default.config();
const port = process.env.PORT || 3000;
(0, database_1.connectDatabase)()
    .then(() => {
    app_1.default.listen(port, () => {
        console.log(`Servidor iniciado en puerto ${port}`);
    });
})
    .catch((error) => {
    console.error("Error al conectar MongoDB", error);
    process.exit(1);
});
