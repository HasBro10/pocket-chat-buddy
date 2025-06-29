
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary = ({ expenses }: ExpenseSummaryProps) => {
  const totalToday = expenses
    .filter(expense => {
      const today = new Date();
      const expenseDate = new Date(expense.date);
      return expenseDate.toDateString() === today.toDateString();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalThisWeek = expenses
    .filter(expense => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(expense.date) >= weekAgo;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover-scale">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalToday)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalThisWeek)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No expenses logged yet</p>
            ) : (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in">
                  <div className="flex-1">
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()} • {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.map(([category, total]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{category}</Badge>
                  </div>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpenseSummary;
