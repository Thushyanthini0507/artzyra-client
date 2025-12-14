"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import apiClient from "@/lib/apiClient";

function ChatInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = searchParams.get("bookingId");
  const chatId = searchParams.get("id");
  const artistId = searchParams.get("artistId");

  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    try {
      if (chatId) {
        // Fetch existing chat by ID
        const response = await apiClient.get(`/api/chats/${chatId}`);
        if (response.data.success) {
          setChat(response.data.data);
          setMessages(response.data.data.messages || []);
        }
      } else if (bookingId) {
        // Fetch all chats and find the one with matching bookingId
        const response = await apiClient.get("/api/chats");
        if (response.data.success) {
          const foundChat = response.data.data.find((c: any) => c.booking?._id === bookingId || c.booking === bookingId);
          if (foundChat) {
            setChat(foundChat);
            setMessages(foundChat.messages || []);
          } else {
            toast.error("Chat not found for this booking");
          }
        }
      } else if (artistId) {
        // For physical artists - create or get existing chat
        // For remote artists - chat only available after booking and payment
        // The backend endpoint handles finding existing chats automatically
        try {
          const createResponse = await apiClient.post("/api/chats/create", { artistId });
          if (createResponse.data.success) {
            setChat(createResponse.data.data);
            setMessages(createResponse.data.data.messages || []);
          }
        } catch (error: any) {
          console.error("Error creating/fetching chat with artist:", error);
          console.error("Error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
          });
          
          const errorMessage = error.response?.data?.message || error.message || "Failed to start chat with artist";
          
          // Handle 404 specifically
          if (error.response?.status === 404) {
            toast.error("Chat endpoint not found. Please contact support.");
            console.error("404 Error - Chat endpoint may not be registered properly");
          } else {
            toast.error(errorMessage);
          }
          
          // If it's a remote artist access error, redirect to booking page
          if (errorMessage.includes("Remote artists can only be contacted after booking") || 
              errorMessage.includes("Chat is only available after payment")) {
            setTimeout(() => {
              router.push(`/bookings/create?artistId=${artistId}`);
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChat();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchChat, 5000);
      return () => clearInterval(interval);
    } else if (artistId) {
      // Redirect to login if not authenticated
      const redirectUrl = encodeURIComponent(`/chat?artistId=${artistId}`);
      router.push(`/auth/login?redirect=${redirectUrl}`);
    }
  }, [user, bookingId, chatId, artistId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    setSending(true);
    try {
      const response = await apiClient.post(`/api/chats/${chat._id}/messages`, {
        content: newMessage,
      });

      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="container mx-auto py-12 px-4 text-center text-white">
        <h2 className="text-xl font-bold mb-4">Chat not found</h2>
        <p className="text-gray-400 mb-6">No chat conversation found for this booking.</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const otherParticipant = chat.participants.find((p: any) => p._id !== user?._id);

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-100px)]">
      <Card className="bg-[#1e1b29] border-white/10 text-white h-full flex flex-col">
        <CardHeader className="border-b border-white/10 flex flex-row items-center gap-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 border border-[#9b87f5]">
            <AvatarImage src={otherParticipant?.profileImage} />
            <AvatarFallback>{otherParticipant?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{otherParticipant?.name}</CardTitle>
            <p className="text-xs text-gray-400">{chat.booking?.service || "Direct Message"}</p>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg: any, index: number) => {
            const isMe = msg.sender === user?._id;
            return (
              <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? "bg-[#9b87f5] text-white rounded-tr-none"
                      : "bg-[#2d2a3d] text-gray-200 rounded-tl-none"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-white/70" : "text-gray-500"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t border-white/10 bg-[#13111c]">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="bg-[#1e1b29] border-white/10 text-white focus:border-[#9b87f5]"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={sending || !newMessage.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function ChatPage() {
  return (
    <PublicLayout>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        </div>
      }>
        <ChatInterface />
      </Suspense>
    </PublicLayout>
  );
}
