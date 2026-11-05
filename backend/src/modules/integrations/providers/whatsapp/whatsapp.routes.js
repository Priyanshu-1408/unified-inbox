import { Router } from "express";
import { sendWhatsAppMessageController } from "./whatsapp.controller.js";

const router = Router();

router.post("/send", sendWhatsAppMessageController);

export default router;
