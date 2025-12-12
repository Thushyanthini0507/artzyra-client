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

  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    try {
      let url = "/chats";
      if (chatId) {
        url = `/chats/${chatId}`;
      } else if (bookingId) {
        url = `/chats/booking?bookingId=${bookingId}`;
        // Note: Backend route is /chats/:id, but we need to support query param search
        // My backend implementation in getChatById handles query params if id is not provided?
        // Wait, my backend route is router.get("/:id", getChatById);
        // And getChatById takes id from params.
        // I need to adjust backend or frontend.
        // Backend: 
        // export const getChatById = asyncHandler(async (req, res) => {
        //   const { id } = req.params;
        //   const { bookingId } = req.query;
        //   ...
        // });
        // If I call /chats/booking?bookingId=..., express will try to match "booking" as :id.
        // So I should call /chats/search?bookingId=... or just handle it in frontend by getting all chats and filtering, or fix backend route.
        // Actually, let's fix the frontend to call /chats first to find the chat, or assume I can pass "booking" as ID and backend handles it? No, backend expects ID to be ObjectId usually if strict.
        // Let's check backend implementation again.
        // It checks `if (bookingId)` from query.
        // But the route is `/:id`.
        // If I call `/api/chats/lookup?bookingId=...`, "lookup" is the ID.
        // I should probably use a specific route for lookup or just use `GET /chats` with filter.
        // My `getChats` (GET /) only returns all chats for user.
        // I'll try to fetch all chats and find the one with the bookingId for now, as it's safer without changing backend routes again.
      }

      if (bookingId) {
        // Fetch all chats and find the one
        const response = await apiClient.get("/chats");
        if (response.data.success) {
          const foundChat = response.data.data.find((c: any) => c.booking?._id === bookingId || c.booking === bookingId);
          if (foundChat) {
            setChat(foundChat);
            setMessages(foundChat.messages || []);
          } else {
            // Chat doesn't exist, maybe create it?
            // Or just show empty state.
            // For this flow, we assume chat is created upon confirmation.
            // If not found, we can't chat.
            toast.error("Chat not found for this booking");
          }
        }
      } else if (chatId) {
        const response = await apiClient.get(`/chats/${chatId}`);
        if (response.data.success) {
          setChat(response.data.data);
          setMessages(response.data.data.messages || []);
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
    }
  }, [user, bookingId, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    setSending(true);
    try {
      const response = await apiClient.post(`/chats/${chat._id}/messages`, {
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
            <p className="text-xs text-gray-400">{chat.booking?.service || "Service"}</p>
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
              className="bg-[#9b87f5] hover:bg-[#8a76d6]"
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
