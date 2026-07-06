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
