//this file is used to make connection between meta watsapp cloud api
const WHATSAPP_API_VERSION = "v23.0";

export function getWhatsAppClient() {
  // this function is used to communicate to watapp api and return
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken) {
    throw new Error("WhatsApp access token is missing");
  }

  if (!phoneNumberId) {
    throw new Error("WhatsApp phone number ID is missing");
  }

  return {
    accessToken,
    phoneNumberId,
    baseURL: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}`,
  };
}
