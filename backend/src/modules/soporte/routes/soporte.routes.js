import express from "express";
import * as controller from "./soporte.controller.js";

const router = express.Router();

router.get("/tickets", controller.getTickets);
router.post("/tickets", controller.createTicket);
router.post("/tickets/:id/messages", controller.addMessage);
router.patch("/tickets/:id/assign", controller.assignTicket);
router.patch("/tickets/:id/close", controller.closeTicket);
router.get("/tickets/:id/timeline", controller.getTimeline);

export default router;

