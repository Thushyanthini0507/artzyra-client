"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    status?: "online" | "offline";
  };
  lastMessage?: string;
  unreadCount?: number;
  updatedAt: Date;
}

interface ChatLayoutProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
  userType: "artist" | "customer";
}

export function ChatLayout({
  conversations,
  currentConversationId,
  onSelectConversation,
  messages,
  onSendMessage,
  currentUserId,
  userType,
}: ChatLayoutProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Sidebar - Conversation List */}
      <Card className="w-80 flex flex-col border-r bg-card/50 backdrop-blur-sm">
        <div className="p-4 border-b space-y-4">
          <h2 className="font-semibold text-lg">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors text-left hover:bg-accent/50",
                  currentConversationId === conversation.id && "bg-accent"
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.participant.avatar} />
                    <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.participant.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{conversation.participant.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {conversation.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
                {conversation.unreadCount ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {conversation.unreadCount}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm overflow-hidden">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-card/80">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentConversation.participant.avatar} />
                  <AvatarFallback>{currentConversation.participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{currentConversation.participant.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation.participant.status === "online" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isMe = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                        isMe
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                      <span className={cn("text-[10px]", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-card/80">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Send className="h-8 w-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  );
}
