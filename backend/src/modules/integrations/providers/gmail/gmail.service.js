import { google } from "googleapis";
import GmailAccount from "./gmail.model.js";

async function getGmailClient() {
  const account = await GmailAccount.findOne();

  if (!account) throw new Error("No Gmail account connected");

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  auth.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
    expiry_date: account.expiryDate,
  });

  auth.on("tokens", async (tokens) => {
    const update = {};

    if (tokens.access_token) update.accessToken = tokens.access_token;
    if (tokens.refresh_token) update.refreshToken = tokens.refresh_token;
    if (tokens.expiry_date) update.expiryDate = tokens.expiry_date;

    if (Object.keys(update).length) {
      await GmailAccount.updateOne({ _id: account._id }, { $set: update });
    }
  });

  return {
    account,
    gmail: google.gmail({ version: "v1", auth }),
  };
}

export async function getGmailMessages(maxResults = 20, pageToken) {
  const { account, gmail } = await getGmailClient();

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    ...(pageToken && { pageToken }),
  });

  const messages = await Promise.all(
    (response.data.messages ?? []).map(async (message) => {
      const { data } = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "metadata",
        metadataHeaders: ["From", "To", "Subject", "Date"],
      });

      const headers = data.payload?.headers ?? [];
      const getHeader = (name) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
          ?.value ?? "";

      return {
        id: data.id,
        threadId: data.threadId,
        from: getHeader("From"),
        to: getHeader("To"),
        subject: getHeader("Subject"),
        date: getHeader("Date"),
        snippet: data.snippet,
        isRead: !data.labelIds?.includes("UNREAD"),
      };
    }),
  );

  return {
    email: account.email,
    messages,
    nextPageToken: response.data.nextPageToken ?? null,
  };
}

export async function getGmailMessage(id) {
  const { gmail } = await getGmailClient();

  const { data } = await gmail.users.messages.get({
    userId: "me",
    id,
    format: "full",
  });

  const getBody = (part) => {
    if (part.mimeType === "text/plain" && part.body?.data) {
      return Buffer.from(part.body.data, "base64url").toString("utf8");
    }

    for (const child of part.parts ?? []) {
      const body = getBody(child);
      if (body) return body;
    }

    return "";
  };

  const headers = data.payload?.headers ?? [];
  const getHeader = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ??
    "";

  return {
    id: data.id,
    threadId: data.threadId,
    from: getHeader("From"),
    to: getHeader("To"),
    subject: getHeader("Subject"),
    date: getHeader("Date"),
    body: getBody(data.payload ?? {}),
    isRead: !data.labelIds?.includes("UNREAD"),
  };
}
