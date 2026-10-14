import { google } from 'googleapis';
import GmailAccount from './gmail.model.js';

export async function getGmailMessages(maxResults = 20) {
  const account = await GmailAccount.findOne();

  if (!account) {
    throw new Error('No Gmail account connected');
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
    expiry_date: account.expiryDate,
  });

  const gmail = google.gmail({ version: 'v1', auth });

  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
  });

  const messages = await Promise.all(
    (response.data.messages ?? []).map(async message => {
      const { data } = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'metadata',
        metadataHeaders: ['From', 'To', 'Subject', 'Date'],
      });

      const headers = data.payload?.headers ?? [];
      const getHeader = name =>
        headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';

      return {
        id: data.id,
        threadId: data.threadId,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        snippet: data.snippet,
        isRead: !data.labelIds?.includes('UNREAD'),
      };
    })
  );

  return {
    email: account.email,
    messages,
    nextPageToken: response.data.nextPageToken ?? null,
  };
}

export async function getGmailMessage(id) {
  const account = await GmailAccount.findOne();

  if (!account) throw new Error('No Gmail account connected');

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
    expiry_date: account.expiryDate,
  });

  const gmail = google.gmail({ version: 'v1', auth });

  const { data } = await gmail.users.messages.get({
    userId: 'me',
    id,
    format: 'full',
  });

  const getBody = (part) => {
    if (part.mimeType === 'text/plain' && part.body?.data)
      return Buffer.from(part.body.data, 'base64url').toString('utf8');

    for (const child of part.parts ?? []) {
      const body = getBody(child);
      if (body) return body;
    }

    return '';
  };

  const headers = data.payload?.headers ?? [];
  const getHeader = name =>
    headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';

  return {
    id: data.id,
    threadId: data.threadId,
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    body: getBody(data.payload ?? {}),
    isRead: !data.labelIds?.includes('UNREAD'),
  };
}