import { randomBytes } from 'node:crypto';
import { google } from 'googleapis';
import GmailAccount from './gmail.model.js';
import { oauthClient, getAuthUrl } from './gmail.oauth.js';
import { getGmailMessages, getGmailMessage } from './gmail.service.js';

const states = new Set();

export function connectGmail(req, res) {
  const state = randomBytes(32).toString('hex');
  states.add(state);

  res.redirect(getAuthUrl(state));
}

export async function gmailCallback(req, res) {
  const { code, state, error } = req.query;

  if (error) return res.status(400).json({ error });
  if (!state || !states.has(state)) {
    return res.status(400).json({ error: 'Invalid OAuth state' });
  }

  states.delete(state);

  try {
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);

    const { data } = await google.oauth2({
      auth: oauthClient,
      version: 'v2',
    }).userinfo.get();

    const update = {
      email: data.email,
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      scope: tokens.scope,
    };

    if (tokens.refresh_token) {
      update.refreshToken = tokens.refresh_token;
    }

    await GmailAccount.findOneAndUpdate(
      { email: data.email },
      { $set: update },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Gmail connected successfully',
      email: data.email,
    });
  } catch (err) {
    console.error('Gmail OAuth error:', err.message);
    res.status(500).json({ error: 'Gmail connection failed' });
  }
}

export async function gmailStatus(req, res) {
  const accounts = await GmailAccount.find({}, 'email');

  res.json({
    connected: accounts.length > 0,
    accounts,
  });
}

export async function gmailMessages(req, res) {
  try {
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      50
    );

    const result = await getGmailMessages(limit);

    res.json(result);
  } catch (err) {
    console.error('Gmail messages error:', err.message);

    res.status(500).json({
      error: 'Failed to fetch Gmail messages',
    });
  }
}

export async function gmailMessage(req, res) {
  try {
    res.json(await getGmailMessage(req.params.id));
  } catch (err) {
    console.error('Gmail message error:', err.message);
    res.status(500).json({ error: 'Failed to fetch email details' });
  }
}