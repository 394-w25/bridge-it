export type JournalEntry = {
  id: string;
  title: string;
  categories: string[];
  shortSummary: string;
  identifiedHardSkills: string[];
  identifiedSoftSkills: string[];
  reflection?: string;
  timestamp: string;  // Changed to string to match EntryDetailModal
  day: number;
  date: string;
}; 