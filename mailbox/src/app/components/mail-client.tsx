"use client";

import { useMemo, useState } from "react";
import { MailMessage, MailFolder, sampleMessages, folders as folderLabels } from "@/app/data/messages";
import { MailSidebar } from "./mail-sidebar";
import { MessageList } from "./message-list";
import { MessageDetail } from "./message-detail";
import { ComposeDrawer, DraftMail } from "./compose-drawer";

export function MailClient() {
  const [messages, setMessages] = useState<MailMessage[]>(() => sampleMessages);
  const [selectedFolder, setSelectedFolder] = useState<MailFolder>("inbox");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const folderCounts = useMemo(() => {
    return messages.reduce<Record<MailFolder, number>>((acc, msg) => {
      acc[msg.folder] = (acc[msg.folder] ?? 0) + 1;
      return acc;
    }, {
      inbox: 0,
      starred: 0,
      sent: 0,
      drafts: 0,
      archive: 0,
      spam: 0,
      trash: 0,
    });
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return messages
      .filter((msg) => msg.folder === selectedFolder && matchesSearch(msg, searchTerm))
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messages, selectedFolder, searchTerm]);

  const selectedMessage = useMemo(() => {
    if (selectedMessageId) {
      const match = filteredMessages.find((msg) => msg.id === selectedMessageId);
      if (match) {
        return match;
      }
    }
    return filteredMessages[0] ?? null;
  }, [filteredMessages, selectedMessageId]);

  const effectiveSelectedMessageId = selectedMessage?.id ?? null;

  const handleSelectFolder = (folder: MailFolder) => {
    setSelectedFolder(folder);
    setSearchTerm("");
    const firstMessage = messages.find((msg) => msg.folder === folder);
    setSelectedMessageId(firstMessage ? firstMessage.id : null);
  };

  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          return { ...msg, unread: false };
        }
        return msg;
      }),
    );
  };

  const handleToggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          const updated = { ...msg, starred: !msg.starred };
          if (!msg.starred && msg.folder !== "starred") {
            return { ...updated, folder: "starred" };
          }
          if (msg.starred && msg.folder === "starred") {
            return { ...updated, folder: "inbox" };
          }
          return updated;
        }
        return msg;
      }),
    );
  };

  const handleToggleRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, unread: !msg.unread } : msg)),
    );
  };

  const handleMoveToFolder = (id: string, target: MailFolder) => {
    if (selectedMessageId === id) {
      setSelectedMessageId(null);
    }
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, folder: target } : msg)),
    );
  };

  const handleSendDraft = (draft: DraftMail) => {
    const newMessage: MailMessage = {
      id: `msg-${Date.now()}`,
      folder: draft.send ? "sent" : "drafts",
      senderName: "You",
      senderEmail: "you@mailbox.app",
      recipientEmail: draft.to,
      subject: draft.subject || "(No subject)",
      preview: draft.body.slice(0, 120) || "Empty message",
      body: draft.body,
      timestamp: new Date().toISOString(),
      unread: false,
      starred: false,
      tags: draft.tags.length ? draft.tags : ["outbound"],
    };
    setMessages((prev) => [newMessage, ...prev]);
    setSelectedFolder(newMessage.folder);
    setSelectedMessageId(newMessage.id);
    setShowCompose(false);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] min-h-[600px] rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
      <MailSidebar
        folders={folderLabels}
        folderCounts={folderCounts}
        selectedFolder={selectedFolder}
        selectedMessage={selectedMessage}
        onSelectFolder={handleSelectFolder}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        onCompose={() => setShowCompose(true)}
      />
      <MessageList
        messages={filteredMessages}
        selectedMessageId={effectiveSelectedMessageId}
        onSelectMessage={handleSelectMessage}
        onToggleStar={handleToggleStar}
        onToggleRead={handleToggleRead}
        onMoveToFolder={handleMoveToFolder}
      />
      <MessageDetail
        message={selectedMessage}
        onToggleStar={handleToggleStar}
        onToggleRead={handleToggleRead}
        onMoveToFolder={handleMoveToFolder}
      />
      <ComposeDrawer open={showCompose} onClose={() => setShowCompose(false)} onSubmit={handleSendDraft} />
    </div>
  );
}

function matchesSearch(message: MailMessage, rawTerm: string) {
  if (!rawTerm.trim()) return true;
  const term = rawTerm.trim().toLowerCase();
  return (
    message.subject.toLowerCase().includes(term) ||
    message.preview.toLowerCase().includes(term) ||
    message.senderName.toLowerCase().includes(term) ||
    message.senderEmail.toLowerCase().includes(term) ||
    message.tags.some((tag) => tag.toLowerCase().includes(term))
  );
}
