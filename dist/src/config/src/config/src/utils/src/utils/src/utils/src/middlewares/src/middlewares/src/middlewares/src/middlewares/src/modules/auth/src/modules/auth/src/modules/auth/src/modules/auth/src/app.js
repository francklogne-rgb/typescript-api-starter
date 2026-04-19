"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
});
app.use('/auth', auth_routes_1.default);
app.use(error_middleware_1.errorHandler);
const start = async () => {
    await (0, db_1.connectDB)();
    app.listen(env_1.env.PORT, () => {
        console.log(`🚀 Server running on port ${env_1.env.PORT}`);
    });
};
start();
