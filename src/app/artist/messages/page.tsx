"use client";

import { useState } from "react";
import { ArtistLayoutNew } from "@/components/layout/artist-layout-new";
import { ChatLayout, Conversation, Message } from "@/components/shared/ChatLayout";

// Mock Data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    participant: {
      id: "c1",
      name: "Alice Johnson",
      status: "online",
    },
    lastMessage: "Hi, I'd like to book you for a wedding shoot.",
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
  },
  {
    id: "2",
    participant: {
      id: "c2",
      name: "Bob Smith",
      status: "offline",
    },
    lastMessage: "Thanks for the great work!",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "c1",
      content: "Hi, are you available next Saturday?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "m2",
      senderId: "artist_me",
      content: "Hello! Yes, I have a slot open in the afternoon.",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: "m3",
      senderId: "c1",
      content: "Great! I'd like to book you for a wedding shoot.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  "2": [
    {
      id: "m4",
      senderId: "artist_me",
      content: "Here are the final edited photos.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
    },
    {
      id: "m5",
      senderId: "c2",
      content: "Thanks for the great work!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],
};

export default function ArtistMessagesPage() {
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(undefined);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSendMessage = (content: string) => {
    if (!currentConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "artist_me",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [currentConversationId]: [...(prev[currentConversationId] || []), newMessage],
    }));

    // Update last message in conversation list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversationId
          ? { ...c, lastMessage: content, updatedAt: new Date() }
          : c
      )
    );
  };

  return (
    <ArtistLayoutNew>
      <div className="h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with your clients</p>
        </div>
        
        <ChatLayout
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          messages={currentConversationId ? messages[currentConversationId] || [] : []}
          onSendMessage={handleSendMessage}
          currentUserId="artist_me"
          userType="artist"
        />
      </div>
    </ArtistLayoutNew>
  );
}
