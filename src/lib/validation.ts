import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive').max(999999999, 'Amount too large'),
  category: z.string().trim().min(1, 'Category is required').max(100, 'Category too long'),
  description: z.string().trim().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

// Budget validation schema
export const budgetSchema = z.object({
  category: z.string().trim().min(1, 'Category is required').max(100, 'Category too long'),
  limit: z.number().positive('Limit must be positive').max(999999999, 'Limit too large'),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

// Storage data validation schema
export const budgetDataSchema = z.object({
  transactions: z.array(z.object({
    id: z.string(),
    type: z.enum(['income', 'expense']),
    amount: z.number(),
    category: z.string(),
    description: z.string(),
    date: z.string(),
  })),
  budgets: z.array(z.object({
    category: z.string(),
    limit: z.number(),
    spent: z.number(),
  })),
});

export type BudgetData = z.infer<typeof budgetDataSchema>;
