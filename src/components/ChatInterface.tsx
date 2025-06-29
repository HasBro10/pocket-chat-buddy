
import React, { useState, useRef, useEffect } from 'react';
import { Send, DollarSign, Clock, CheckSquare, FileText, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseUserMessage } from '@/utils/messageParser';
import { formatCurrency } from '@/utils/formatCurrency';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system' | 'confirmation';
  timestamp: Date;
  category?: string;
  amount?: number;
  parsedType?: 'expense' | 'reminder' | 'task' | 'note';
  pendingData?: any;
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

  const handleConfirmLog = (messageId: string, confirm: boolean) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.pendingData) return;

    if (confirm) {
      // Log the item based on its type
      if (message.parsedType === 'expense') {
        onExpenseAdded(message.pendingData);
      } else if (message.parsedType === 'reminder') {
        onReminderAdded(message.pendingData);
      } else if (message.parsedType === 'task') {
        onTaskAdded(message.pendingData);
      } else if (message.parsedType === 'note') {
        onNoteAdded(message.pendingData);
      }

      // Add success message
      const successMessage: Message = {
        id: Date.now().toString(),
        text: `✅ Logged successfully!`,
        type: 'system',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, successMessage]);
    } else {
      // Add cancelled message
      const cancelMessage: Message = {
        id: Date.now().toString(),
        text: `❌ Cancelled - not logged.`,
        type: 'system',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, cancelMessage]);
    }

    // Remove the confirmation message
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

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
      if (parsed.type !== 'unknown') {
        let confirmationText = '';
        let pendingData = null;
        
        if (parsed.type === 'expense' && parsed.amount) {
          confirmationText = `💰 Log expense: ${formatCurrency(parsed.amount)} for ${parsed.category || 'General'}?`;
          pendingData = {
            id: Date.now().toString(),
            amount: parsed.amount,
            category: parsed.category || 'General',
            description: parsed.description || inputText,
            date: new Date(),
          };
        } else if (parsed.type === 'reminder') {
          confirmationText = `⏰ Set reminder: ${parsed.description}?`;
          pendingData = {
            id: Date.now().toString(),
            description: parsed.description,
            date: parsed.date || new Date(),
          };
        } else if (parsed.type === 'task') {
          confirmationText = `📝 Add task: ${parsed.description}?`;
          pendingData = {
            id: Date.now().toString(),
            description: parsed.description,
            completed: false,
            date: new Date(),
          };
        } else if (parsed.type === 'note') {
          confirmationText = `📄 Save note: ${parsed.description}?`;
          pendingData = {
            id: Date.now().toString(),
            content: parsed.description,
            date: new Date(),
          };
        }

        const confirmationMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: confirmationText,
          type: 'confirmation',
          timestamp: new Date(),
          parsedType: parsed.type,
          pendingData: pendingData,
        };

        setMessages(prev => [...prev, confirmationMessage]);
      } else {
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I didn't quite understand that. Try something like 'Lunch £12' or 'Remind me to call John tomorrow'.",
          type: 'system',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, systemMessage]);
      }
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
                  : message.type === 'confirmation'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-gray-100 text-gray-800'
              } shadow-sm`}
            >
              <div className="flex items-center gap-2">
                {getMessageIcon(message)}
                <span className="text-sm">{message.text}</span>
              </div>
              
              {message.type === 'confirmation' && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => handleConfirmLog(message.id, true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConfirmLog(message.id, false)}
                    className="px-3 py-1 text-xs"
                  >
                    <X className="w-3 h-3 mr-1" />
                    No
                  </Button>
                </div>
              )}
              
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
