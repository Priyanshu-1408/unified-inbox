import { sendWhatsAppMessage } from "./whatsapp.service.js";

export async function sendWhatsAppMessageController(req, res) {
  try {
    const { to, body } = req.body;

    if (!to || !body) {
      return res.status(400).json({
        success: false,
        message: "Recipient number and message body are required",
      });
    }

    const result = await sendWhatsAppMessage({ to, body });

    return res.status(200).json({
      success: true,
      message: "WhatsApp message sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("WhatsApp Send Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export function verifyWhatsAppWebhook(req, res) {  // for receiving message from meta. first meta verify our app
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"]; //token send by meta for verification
  const challenge = req.query["hub.challenge"]; //random challenge number send by meta

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN  
  ) {
    console.log("WhatsApp webhook verified successfully");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

export async function handleWhatsAppWebhook(req, res) {
  try {
    const body = req.body;

    console.log("Incoming WhatsApp Webhook:", JSON.stringify(body, null, 2));  //null means we dont want to filter anything in the response body and 2 means 2 spaces indentation

    return res.sendStatus(200);
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error.message);
    return res.sendStatus(500);
  }
}