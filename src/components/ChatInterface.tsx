
import React, { useState, useRef, useEffect } from 'react';
import { Send, DollarSign, Clock, CheckSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseUserMessage } from '@/utils/messageParser';
import { formatCurrency } from '@/utils/formatCurrency';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  timestamp: Date;
  category?: string;
  amount?: number;
  parsedType?: 'expense' | 'reminder' | 'task' | 'note';
}

interface ChatInterfaceProps {
  onExpenseAdded: (expense: any) => void;
  onTaskAdded: (task: any) => void;
  onReminderAdded: (reminder: any) => void;
  onNoteAdded: (note: any) => void;
}

const ChatInterface = ({ onExpenseAdded, onTaskAdded, onReminderAdded, onNoteAdded }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your expense tracker assistant. Try typing something like 'Coffee £3.50' or 'Remind me to pay rent tomorrow'!",
      type: 'system',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      type: 'user',
      timestamp: new Date(),
    };

    const parsed = parseUserMessage(inputText);
    
    setMessages(prev => [...prev, userMessage]);

    // Generate system response based on parsed message
    setTimeout(() => {
      let systemResponse = '';
      
      if (parsed.type === 'expense' && parsed.amount) {
        systemResponse = `✅ Logged expense: ${formatCurrency(parsed.amount)} for ${parsed.category || 'General'}`;
        onExpenseAdded({
          id: Date.now().toString(),
          amount: parsed.amount,
          category: parsed.category || 'General',
          description: parsed.description || inputText,
          date: new Date(),
        });
      } else if (parsed.type === 'reminder') {
        systemResponse = `⏰ Reminder set: ${parsed.description}`;
        onReminderAdded({
          id: Date.now().toString(),
          description: parsed.description,
          date: parsed.date || new Date(),
        });
      } else if (parsed.type === 'task') {
        systemResponse = `📝 Task added: ${parsed.description}`;
        onTaskAdded({
          id: Date.now().toString(),
          description: parsed.description,
          completed: false,
          date: new Date(),
        });
      } else if (parsed.type === 'note') {
        systemResponse = `📄 Note saved: ${parsed.description}`;
        onNoteAdded({
          id: Date.now().toString(),
          content: parsed.description,
          date: new Date(),
        });
      } else {
        systemResponse = "I didn't quite understand that. Try something like 'Lunch £12' or 'Remind me to call John tomorrow'.";
      }

      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: systemResponse,
        type: 'system',
        timestamp: new Date(),
        amount: parsed.amount,
      };

      // Only assign parsedType if it's not 'unknown'
      if (parsed.type !== 'unknown') {
        systemMessage.parsedType = parsed.type;
      }

      setMessages(prev => [...prev, systemMessage]);
    }, 500);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getMessageIcon = (message: Message) => {
    if (message.type === 'user') return null;
    
    switch (message.parsedType) {
      case 'expense':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-purple-500" />;
      case 'note':
        return <FileText className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              } shadow-sm`}
            >
              <div className="flex items-center gap-2">
                {getMessageIcon(message)}
                <span className="text-sm">{message.text}</span>
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type an expense, reminder, or task..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Try: "Coffee £3.50", "Remind me to pay bills", "Add call dentist to my tasks"
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
