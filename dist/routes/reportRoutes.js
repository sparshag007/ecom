"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/reportRoutes.ts
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const router = (0, express_1.Router)();
router.get('/sales/total', reportController_1.getTotalSales);
exports.default = router;
