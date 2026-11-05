import { getWhatsAppClient } from "./whatsapp.client.js";

export async function sendWhatsAppMessage({ to, body }) {
  const { accessToken, baseURL } = getWhatsAppClient();

  const response = await fetch(`${baseURL}/messages`, {
    method: "POST",

    headers: {   //send additional infor mation to api 
      Authorization: `Bearer ${accessToken}`,   // meta that our application is authorised
      "Content-Type": "application/json",  //tells api that we send json data 
    },

    body: JSON.stringify({      //use strinify because in fetch we should send data in string format 
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        body,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to send WhatsApp message");
  }

  return {
    success: true,
    messageId: data.messages?.[0]?.id,  // id got from meta
    data,
  };
}
