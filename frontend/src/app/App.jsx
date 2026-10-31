import Sidebar from "../components/layout/Sidebar.jsx";
import { useState } from "react";
import Topbar from "../components/layout/Topbar.jsx";
import MessageList from "../features/inbox/components/MessageList.jsx";
import MessageView from "../features/inbox/components/MessageView.jsx";
import ReplyList from "../features/inbox/components/ReplyList.jsx";
import ReplyBox from "../features/inbox/components/ReplyBox.jsx";
import { initialMessages } from "../features/inbox/inbox.data.js";
import { useEffect } from "react";
import { getGmailStatus, getGmailMessages,getGmailMessage } from "../services/gmailApi.js";

const navigation = [
  { name: "All messages", icon: "▤" },
  { name: "Unread", icon: "●" },
  { name: "Starred", icon: "☆" },
];

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState(initialMessages[0]);
  const [filter, setFilter] = useState("All messages");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState([]);
  const [active, setActive] = useState("Inbox");

  //for gmail backend api calling through useeffect
  const [gmailConnected, setGmailConnected] = useState(false);
const [gmailMessages, setGmailMessages] = useState([]);
const [selectedGmailMessage, setSelectedGmailMessage] = useState(null);

useEffect(() => {
  async function loadGmailData() {
    try {
      const status = await getGmailStatus();
      setGmailConnected(status.connected);

      if (status.connected) {
        const data = await getGmailMessages();
        setGmailMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Gmail data fetch error:", error.message);
    }
  }

  loadGmailData();
}, []);







useEffect(() => { // if the selected message is from gmail then there is a api ca;ll
  if (!selected || selected.platform !== "Gmail") {
    setSelectedGmailMessage(null);    //if condition is used to stop the clear the state so that if the user select outlook or any other
    // platfoam so the message is not shown on page
    return;
  }

  let ignore = false; // this flag is used to stop api response data to another messag eif the response come late

  async function loadEmailDetails() {
    try {
      const data = await getGmailMessage(selected.id);

      if (!ignore) {
        setSelectedGmailMessage(data);
      }
    } catch (error) {
      console.error("Email details fetch error:", error.message);
    }
  }

  loadEmailDetails();

  return () => {  //this is a cleanup function      doubt h
    ignore = true;
  };
}, [selected?.id, selected?.platform]);


const formattedGmailMessages = gmailMessages.map((mail) => {   // for fomat compatibilty of backend response to fronted
  const senderMatch = mail.from?.match(/^(.*?)\s*<(.+)>$/);

  return {
    id: mail.id,
    threadId: mail.threadId,
    sender: senderMatch ? senderMatch[1].replaceAll('"', "") : mail.from,
    email: senderMatch ? senderMatch[2] : mail.from,
    subject: mail.subject || "(No Subject)",
    text: mail.snippet || "",
    time: mail.date ? new Date(mail.date).toLocaleString() : "",
    platform: "Gmail",
    read: mail.isRead,
    starred: false,
    color: "bg-red-100 text-red-600",
  };
});


const allMessages = [
  ...initialMessages.filter((message) => message.platform !== "Gmail"),
  ...formattedGmailMessages,
];

  const visibleMessages = allMessages.filter((message) => {
    const matchesPlatform =
      active === "Inbox" ||
      (active === "Gmail" && message.platform === "Gmail") ||
      (active === "Slack" && message.platform === "Slack");

    const matchesSearch = `${message.sender} ${message.subject} ${message.text}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter !== "Unread" || !message.read;

    const matchesStarred = filter !== "Starred" || message.starred;

    return matchesPlatform && matchesSearch && matchesFilter && matchesStarred;
  });

  function selectMessage(message) {
    setSelected(message);
    setMessages((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, read: true } : item,
      ),
    );
  }

  function toggleStar(id) {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, starred: !message.starred } : message,
      ),
    );

    if (selected?.id === id) {
      setSelected((current) => ({ ...current, starred: !current.starred }));
    }
  }

  function sendReply(event) {
    event.preventDefault();

    if (!reply.trim() || !selected) return;

    setSent((current) => [
      ...current,
      { id: Date.now(), messageId: selected.id, text: reply.trim() },
    ]);

    setReply("");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar
        active={active}
        setActive={setActive}
        filter={filter}
        setFilter={setFilter}
        messageCount={messages.length}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <Topbar active={active} search={search} setSearch={setSearch} />

        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)]">
          <MessageList
            messages={visibleMessages}
            selected={selected}
            onSelect={selectMessage}
            onToggleStar={toggleStar}
          />

          <section className="flex min-w-0 flex-col bg-slate-50">
            {selected ? (
              <>
                <MessageView message={selected} onToggleStar={toggleStar} />

                <div className="flex-1 overflow-y-auto p-8">
                  <ReplyList
                    replies={sent.filter(
                      (item) => item.messageId === selected.id,
                    )}
                  />
                </div>

                <ReplyBox
                  platform={selected.platform}
                  reply={reply}
                  setReply={setReply}
                  onSend={sendReply}
                />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-slate-400">
                Select a message to view the conversation.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}











