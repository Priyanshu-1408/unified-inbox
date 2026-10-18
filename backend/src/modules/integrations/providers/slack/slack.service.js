import { WebClient } from '@slack/web-api';
import SlackAccount from './slack.model.js';

async function getSlackClient() {
  const account = await SlackAccount.findOne();
  if (!account) throw new Error('No Slack account connected');

  return new WebClient(account.accessToken);
}

export async function getSlackChannels() {
  const slack = await getSlackClient();

  const { channels = [], response_metadata } =
    await slack.conversations.list({
      types: 'public_channel',
      exclude_archived: true,
      limit: 100,
    });

  return {
    channels: channels.map(({ id, name, is_member }) => ({
      id,
      name,
      isMember: is_member,
    })),
    nextCursor: response_metadata?.next_cursor || null,
  };
}

export async function getSlackMessages(channel, limit = 20, cursor) {
  const slack = await getSlackClient();

  const { messages = [], response_metadata } =
    await slack.conversations.history({
      channel,
      limit,
      ...(cursor && { cursor }),
    });

  return {
    messages: messages.map(message => ({
      id: message.ts,
      text: message.text || '',
      user: message.user || null,
      timestamp: message.ts,
      threadTs: message.thread_ts || null,
    })),
    nextCursor: response_metadata?.next_cursor || null,
  };
}

export async function sendSlackMessage(channel, text) {
  const slack = await getSlackClient();

  const response = await slack.chat.postMessage({
    channel,
    text,
  });

  return {
    id: response.ts,
    channel: response.channel,
    text: response.message?.text || text,
    timestamp: response.ts,
  };
}