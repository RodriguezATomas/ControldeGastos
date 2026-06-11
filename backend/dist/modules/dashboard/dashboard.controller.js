"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDashboard = void 0;
const dashboard_service_1 = require("./dashboard.service");
const showDashboard = async (req, res) => {
    try {
        const dashboard = await (0, dashboard_service_1.getDashboard)(req.user._id.toString(), req.query.month);
        res.json(dashboard);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.showDashboard = showDashboard;
