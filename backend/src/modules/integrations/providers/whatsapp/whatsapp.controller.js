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
