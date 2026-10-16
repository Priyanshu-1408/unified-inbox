import { randomBytes } from "node:crypto";
import SlackAccount from "./slack.model.js";
import { getSlackAuthUrl, exchangeSlackCode } from "./slack.oauth.js";

const states = new Set();

export function connectSlack(req, res) {
  const state = randomBytes(32).toString("hex");
  states.add(state);
  res.redirect(getSlackAuthUrl(state));
}

export async function slackCallback(req, res) {
  const { code, state, error } = req.query;

  if (error) return res.status(400).json({ error });
  if (!state || !states.has(state)) {
    return res.status(400).json({ error: "Invalid OAuth state" });
  }

  states.delete(state);

  try {
    const data = await exchangeSlackCode(code);

    ```
await SlackAccount.findOneAndUpdate(
  { teamId: data.team.id },
  {
    teamId: data.team.id,
    teamName: data.team.name,
    userId: data.authed_user.id,
    accessToken: data.access_token,
    scope: data.scope,
  },
  { upsert: true, new: true, runValidators: true }
);

res.json({
  success: true,
  message: 'Slack connected successfully',
  team: data.team.name,
});
```;
  } catch (err) {
    console.error("Slack OAuth error:", err.message);
    res.status(500).json({ error: "Slack connection failed" });
  }
}

export async function slackStatus(req, res) {
try {
const accounts = await SlackAccount.find({}, 'teamId teamName userId');

```
res.json({
  connected: accounts.length > 0,
  accounts,
});
```

} catch (err) {
console.error('Slack status error:', err);
res.status(500).json({ error: 'Failed to fetch Slack status' });
}
}

