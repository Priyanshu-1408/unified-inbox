import { WebClient } from "@slack/web-api";

export function getSlackAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID,
    redirect_uri: process.env.SLACK_REDIRECT_URI,
    scope: "channels:history,channels:read,chat:write,users:read",
    state,
  });

  return `https://slack.com/oauth/v2/authorize?${params}`;
}

export async function exchangeSlackCode(code) {
  const response = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri: process.env.SLACK_REDIRECT_URI,
    }),
  });

  const data = await response.json();

  if (!data.ok) throw new Error(data.error);

  return data;
}

export function getSlackClient(token) {
  return new WebClient(token);
}
