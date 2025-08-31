import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/ui/footer";
import { supabase } from "@/integrations/supabase/client";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  chat_username: string;
  created_at: string;
}

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate random anonymous username
  const [username] = useState(() =>
    `anon_${Math.random().toString(36).substring(2, 8)}`
  );

  // Load messages and set up real-time subscription
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesData) {
        setMessages(messagesData);
      }
    };

    loadMessages();

    // Set up real-time subscription for messages
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const messageData = {
        chat_id: chatId,
        content: newMessage.trim(),
        chat_username: username,
        user_id: null
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) {
        toast.error("Failed to send message");
      } else {
        setNewMessage("");
      }
    } catch (err) {
      toast.error("An error occurred while sending the message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <GradientBars bars={25} colors={['hsl(var(--primary))', 'transparent']} />

      <Navigation />

      <div className="relative z-10 flex-1 flex flex-col px-6 py-8">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-instrument font-bold text-foreground">
                Chat Room
              </h1>
            </div>
            <p className="text-muted-foreground">
              Chatting as {username} • Anonymous chat room
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-card/50 backdrop-blur-md border border-border rounded-lg overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex justify-start"
                    >
                      <div className="max-w-[70%] rounded-lg px-4 py-2 bg-card border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-white">
                            {message.chat_username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-foreground">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !newMessage.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;