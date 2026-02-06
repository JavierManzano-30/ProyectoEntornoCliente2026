import express from "express";
import * as controller from "./bi.controller.js";

const router = express.Router();

router.get("/kpis", controller.getKPIs);
router.post("/reports", controller.createReport);
router.post("/reports/:id/run", controller.runReport);

export default router;
