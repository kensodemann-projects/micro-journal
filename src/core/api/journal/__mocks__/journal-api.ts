import { vi, type Mock } from 'vitest';
import type { Category, Entry, EntryType, Mood, SuccessResponse } from '../types';
import { mockCategories, mockEntries, mockMoods, mockTypes } from './mock-data';

export const getCategories: Mock<(token: string) => Promise<Category[]>> = vi.fn().mockResolvedValue(mockCategories);

export const getCategory: Mock<(token: string, categoryId: string) => Promise<Category>> = vi
  .fn()
  .mockResolvedValue(mockCategories[0]);

export const saveCategory: Mock<
  (token: string, category: Category | Omit<Category, 'id' | 'created_at'>) => Promise<Category>
> = vi.fn().mockResolvedValue(mockCategories[0]);

export const getMoods: Mock<(token: string) => Promise<Mood[]>> = vi.fn().mockResolvedValue(mockMoods);

export const getMood: Mock<(token: string, moodId: string) => Promise<Mood>> = vi.fn().mockResolvedValue(mockMoods[0]);

export const getEntryTypes: Mock<(token: string) => Promise<EntryType[]>> = vi.fn().mockResolvedValue(mockTypes);

export const getEntryType: Mock<(token: string, entryTypeId: string) => Promise<EntryType>> = vi
  .fn()
  .mockResolvedValue(mockTypes[0]);

export const getEntries: Mock<(token: string) => Promise<Entry[]>> = vi.fn().mockResolvedValue(mockEntries);

export const getEntry: Mock<(token: string, entryId: string) => Promise<Entry>> = vi
  .fn()
  .mockResolvedValue(mockEntries[0]);

export const saveEntry: Mock<
  (token: string, entry: Entry | Omit<Entry, 'id' | 'created_at' | 'user_id'>) => Promise<Entry>
> = vi.fn().mockResolvedValue(mockEntries[0]);

export const removeEntry: Mock<(token: string, entryId: string) => Promise<SuccessResponse>> = vi
  .fn()
  .mockResolvedValue({ success: true });
