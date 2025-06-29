
interface ParsedMessage {
  type: 'expense' | 'reminder' | 'task' | 'note' | 'unknown';
  amount?: number;
  category?: string;
  description?: string;
  date?: Date;
}

export const parseUserMessage = (message: string): ParsedMessage => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for reminder patterns FIRST (before expense parsing)
  if (lowerMessage.includes('remind') || lowerMessage.includes('reminder')) {
    const description = message.replace(/remind me to\s*/i, '').replace(/reminder:?\s*/i, '').trim();
    
    // Simple date parsing for common phrases
    let reminderDate = new Date();
    if (lowerMessage.includes('tomorrow')) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    } else if (lowerMessage.includes('next week')) {
      reminderDate.setDate(reminderDate.getDate() + 7);
    }
    
    return {
      type: 'reminder',
      description,
      date: reminderDate
    };
  }
  
  // Parse amount - now includes standalone numbers as £
  const amountRegex = /[£$]?(\d+(?:\.\d{2})?)/;
  const amountMatch = message.match(amountRegex);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;
  
  // Common expense keywords and their categories
  const categoryKeywords = {
    'Food': ['lunch', 'dinner', 'breakfast', 'coffee', 'restaurant', 'meal', 'food', 'pizza', 'burger', 'sandwich'],
    'Transport': ['taxi', 'uber', 'bus', 'train', 'fuel', 'petrol', 'gas', 'parking', 'transport'],
    'Shopping': ['shopping', 'clothes', 'shirt', 'shoes', 'book', 'amazon', 'store'],
    'Entertainment': ['cinema', 'movie', 'game', 'concert', 'ticket', 'entertainment'],
    'Health': ['doctor', 'medicine', 'pharmacy', 'hospital', 'dentist', 'health'],
    'Bills': ['bill', 'electricity', 'water', 'internet', 'phone', 'rent', 'mortgage'],
    'Groceries': ['groceries', 'supermarket', 'tesco', 'sainsbury', 'asda', 'market']
  };
  
  // Determine category based on keywords
  let category = 'General';
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      category = cat;
      break;
    }
  }
  
  // Check for expense patterns (standalone numbers now count as expenses)
  if (amount && (
    lowerMessage.includes('£') || 
    lowerMessage.includes('$') || 
    lowerMessage.includes('spent') || 
    lowerMessage.includes('cost') ||
    lowerMessage.includes('paid') ||
    Object.values(categoryKeywords).flat().some(keyword => lowerMessage.includes(keyword)) ||
    // If it's just a number with context words, treat as expense
    /^\d+(\.\d{2})?\s*\w+/.test(message.trim()) ||
    /\w+\s*\d+(\.\d{2})?$/.test(message.trim())
  )) {
    return {
      type: 'expense',
      amount,
      category,
      description: message.trim()
    };
  }
  
  // Check for task patterns
  if (lowerMessage.includes('task') || lowerMessage.includes('add') || lowerMessage.includes('todo') || lowerMessage.includes('to-do')) {
    const description = message
      .replace(/add\s*/i, '')
      .replace(/task:?\s*/i, '')
      .replace(/to my tasks?/i, '')
      .replace(/todo:?\s*/i, '')
      .replace(/to-do:?\s*/i, '')
      .trim();
    
    return {
      type: 'task',
      description
    };
  }
  
  // Check for note patterns
  if (lowerMessage.includes('note') || lowerMessage.includes('remember') || lowerMessage.includes('save')) {
    const description = message
      .replace(/note:?\s*/i, '')
      .replace(/remember:?\s*/i, '')
      .replace(/save:?\s*/i, '')
      .trim();
    
    return {
      type: 'note',
      description
    };
  }
  
  return {
    type: 'unknown',
    description: message
  };
};
