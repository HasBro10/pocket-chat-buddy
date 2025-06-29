import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatInterface from '@/components/ChatInterface';
import ExpenseSummary from '@/components/ExpenseSummary';
import TasksAndReminders from '@/components/TasksAndReminders';
import { MessageSquare, BarChart3, CheckSquare } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface Task {
  id: string;
  description: string;
  completed: boolean;
  date: Date;
}

interface Reminder {
  id: string;
  description: string;
  date: Date;
}

interface Note {
  id: string;
  content: string;
  date: Date;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const handleExpenseAdded = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const handleExpenseUpdated = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  const handleExpenseDeleted = (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  };

  const handleTaskAdded = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleReminderAdded = (reminder: Reminder) => {
    setReminders(prev => [...prev, reminder]);
  };

  const handleNoteAdded = (note: Note) => {
    setNotes(prev => [...prev, note]);
  };

  const handleTaskToggle = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTaskDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleReminderDelete = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const handleNoteDelete = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">
            💬 Expense Chat Tracker
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in">
            Track expenses, manage tasks, and set reminders through natural conversation
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Tasks & More
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <div className="h-[600px]">
                <ChatInterface
                  onExpenseAdded={handleExpenseAdded}
                  onTaskAdded={handleTaskAdded}
                  onReminderAdded={handleReminderAdded}
                  onNoteAdded={handleNoteAdded}
                />
              </div>
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseSummary 
                expenses={expenses} 
                onExpenseUpdated={handleExpenseUpdated}
                onExpenseDeleted={handleExpenseDeleted}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <TasksAndReminders
                tasks={tasks}
                reminders={reminders}
                notes={notes}
                onTaskToggle={handleTaskToggle}
                onTaskDelete={handleTaskDelete}
                onReminderDelete={handleReminderDelete}
                onNoteDelete={handleNoteDelete}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            💡 Try saying: "Coffee £3.50", "Remind me to pay bills", "Add call bank to tasks", or "Note: Check receipts"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
