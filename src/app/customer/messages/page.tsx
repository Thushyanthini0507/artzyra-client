"use client";

import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { ChatLayout, Conversation, Message } from "@/components/shared/ChatLayout";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function CustomerMessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get("chatId");
  
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(initialChatId || undefined);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await apiClient.get("/chats");
        if (response.data.success) {
          const formattedConversations = response.data.data.map((chat: any) => {
            // Find the other participant (Artist)
            const otherParticipant = chat.participants.find((p: any) => p._id !== user?._id);
            return {
              id: chat._id,
              participant: {
                id: otherParticipant?._id || "unknown",
                name: otherParticipant?.name || "Unknown User",
                status: "offline", // TODO: Implement online status
                avatar: otherParticipant?.profileImage,
              },
              lastMessage: chat.lastMessage,
              unreadCount: 0, // TODO: Implement unread count
              updatedAt: new Date(chat.updatedAt),
            };
          });
          setConversations(formattedConversations);
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages for current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentConversationId) return;

      try {
        const response = await apiClient.get(`/chats/${currentConversationId}`);
        if (response.data.success) {
          const formattedMessages = response.data.data.messages.map((msg: any) => ({
            id: msg._id,
            senderId: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [currentConversationId]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) return;

    try {
      const response = await apiClient.post(`/chats/${currentConversationId}/messages`, {
        content,
      });

      if (response.data.success) {
        const newMsg = response.data.data;
        const formattedMsg: Message = {
          id: newMsg._id,
          senderId: newMsg.sender,
          content: newMsg.content,
          timestamp: new Date(newMsg.timestamp),
        };

        setMessages((prev) => [...prev, formattedMsg]);

        // Update conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConversationId
              ? { ...c, lastMessage: content, updatedAt: new Date() }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <CustomerLayout>
      <div className="flex-1 p-8 h-full">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <p className="text-gray-400">Chat with artists</p>
          </div>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Loading chats...
            </div>
          ) : (
            <ChatLayout
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={setCurrentConversationId}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user?._id || ""}
              userType="customer"
            />
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
