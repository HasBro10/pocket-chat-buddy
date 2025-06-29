
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Trash2, FileText } from 'lucide-react';

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

interface TasksAndRemindersProps {
  tasks: Task[];
  reminders: Reminder[];
  notes: Note[];
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onReminderDelete: (id: string) => void;
  onNoteDelete: (id: string) => void;
}

const TasksAndReminders = ({ 
  tasks, 
  reminders, 
  notes, 
  onTaskToggle, 
  onTaskDelete, 
  onReminderDelete,
  onNoteDelete 
}: TasksAndRemindersProps) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'reminders' | 'notes'>('tasks');

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'tasks' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('tasks')}
          className="rounded-b-none"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Tasks ({pendingTasks.length})
        </Button>
        <Button
          variant={activeTab === 'reminders' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('reminders')}
          className="rounded-b-none"
        >
          <Clock className="w-4 h-4 mr-2" />
          Reminders ({reminders.length})
        </Button>
        <Button
          variant={activeTab === 'notes' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('notes')}
          className="rounded-b-none"
        >
          <FileText className="w-4 h-4 mr-2" />
          Notes ({notes.length})
        </Button>
      </div>

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {pendingTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg animate-fade-in">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTaskToggle(task.id)}
                        className="p-1 h-auto"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </Button>
                      <div className="flex-1">
                        <p className="font-medium">{task.description}</p>
                        <p className="text-sm text-gray-600">
                          Added {new Date(task.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTaskDelete(task.id)}
                        className="p-1 h-auto text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {completedTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg opacity-75">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium line-through">{task.description}</p>
                        <p className="text-sm text-gray-600">
                          Completed {new Date(task.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTaskDelete(task.id)}
                        className="p-1 h-auto text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {tasks.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-500 text-center py-8">
                  No tasks yet! Try typing "Add call dentist to my tasks" in the chat.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'reminders' && (
        <Card>
          <CardContent className="pt-6">
            {reminders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No reminders yet! Try typing "Remind me to pay rent tomorrow" in the chat.
              </p>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg animate-fade-in">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">{reminder.description}</p>
                      <p className="text-sm text-gray-600">
                        Due {new Date(reminder.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReminderDelete(reminder.id)}
                      className="p-1 h-auto text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'notes' && (
        <Card>
          <CardContent className="pt-6">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No notes yet! Try typing "Note: Remember to check bank statements" in the chat.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg animate-fade-in">
                    <FileText className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium whitespace-pre-wrap">{note.content}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {new Date(note.date).toLocaleDateString()} at {new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNoteDelete(note.id)}
                      className="p-1 h-auto text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TasksAndReminders;
