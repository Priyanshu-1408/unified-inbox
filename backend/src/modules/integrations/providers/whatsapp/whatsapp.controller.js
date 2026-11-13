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
  console.log("WHATSAPP WEBHOOK HIT");
  try {
    const body = req.body;
    if (body.object !== "whatsapp_business_account") {
      return res.sendStatus(404);
    }

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;

        // Incoming messages
        for (const message of value.messages ?? []) {   //funding sender details
          const contact = value.contacts?.find(
            (item) => item.wa_id === message.from
          );

          const incomingMessage = {
            messageId: message.id,
            from: message.from,
            senderName: contact?.profile?.name ?? "",
            timestamp: message.timestamp,
            type: message.type,
            text: message.text?.body ?? "",
          };

          console.log("Incoming WhatsApp Message:", incomingMessage);
        }

        // Message delivery status updates
        for (const status of value.statuses ?? []) {
          console.log("WhatsApp Message Status:", {
            messageId: status.id,
            recipient: status.recipient_id,
            status: status.status,
            timestamp: status.timestamp,
          });
        }
      }
    }

      

    return res.sendStatus(200);
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error.message);
    return res.sendStatus(500);
  }
}   









