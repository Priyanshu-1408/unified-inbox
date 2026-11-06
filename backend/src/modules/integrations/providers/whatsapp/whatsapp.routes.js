import { Router } from "express";
import { sendWhatsAppMessageController,  verifyWhatsAppWebhook,
  handleWhatsAppWebhook } from "./whatsapp.controller.js";

const router = Router();

router.post("/send", sendWhatsAppMessageController);
router.get("/webhook", verifyWhatsAppWebhook);

router.post("/webhook", handleWhatsAppWebhook);

export default router;
