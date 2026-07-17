interface ReferenceRecord {
  id: number;
  created_at: number;
  name: string;
}

export type Category = ReferenceRecord;
export type EntryType = ReferenceRecord;
export interface Mood extends ReferenceRecord {
  rank: 1 | 2 | 3; // positive | neutral | negative
}

export interface Entry {
  id: number;
  created_at: number;
  user_id: number;
  date: string;
  entry_time: number;
  subject: string;
  description: string;
  category_id: number;
  type_id: number;
  mood_id: number;
}
