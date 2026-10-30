
const API_BASE_URL = 'http://localhost:5000/api/integrations/gmail';

export async function getGmailStatus() {
  const response = await fetch(`${API_BASE_URL}/status`);

  if (!response.ok) {
    throw new Error('Failed to fetch Gmail connection status');
  }

  return response.json();
}

export async function getGmailMessages() {
  const response = await fetch(`${API_BASE_URL}/messages?limit=20`);

  if (!response.ok) {
    throw new Error('Failed to fetch Gmail messages');
  }

  return response.json();
}

export async function getGmailMessage(id) {
  const response = await fetch(
    `${API_BASE_URL}/messages/${encodeURIComponent(id)}`  //encodeURIComponent is used for safely handle id like "id" into id
  );
                                    
  if (!response.ok) {
    throw new Error('Failed to fetch email details');
  }

  return response.json();
}

export async function sendGmailEmail({ to, subject, body }) {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // tells the backend that body have json data 
    },
    body: JSON.stringify({ to, subject, body }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to send email');
  }
 
  return result;
}
