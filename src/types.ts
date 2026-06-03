/**
 * Shared Type Definitions for Yala Smart Municipality Platform
 */

export type LanguageCode = "th" | "en" | "ms";

export type ComplaintStatus = "received" | "progress" | "completed";

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ProgressLog {
  status: ComplaintStatus;
  date: string;
  note: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  dept: string;
  location: string;
  coordinates: Coordinate;
  imageUrl?: string;
  status: ComplaintStatus;
  date: string;
  trackingNum: string;
  priority: PriorityLevel;
  progressLog: ProgressLog[];
}

export interface AISuggestion {
  category: string;
  department: string;
  confidence: number;
  priority: PriorityLevel;
  explanation: string;
}

export interface Project {
  id: string;
  name: string;
  nameEn: string;
  nameMs: string;
  description: string;
  descriptionEn: string;
  descriptionMs: string;
  budget: string;
  progress: number; // percentage (0 - 100)
  startDate: string;
  endDate: string;
  location: string;
  coordinates?: Coordinate;
  timeline: {
    title: string;
    titleEn: string;
    titleMs: string;
    date: string;
    completed: boolean;
  }[];
}

export interface TourismSpot {
  id: string;
  name: string;
  nameEn: string;
  nameMs: string;
  description: string;
  descriptionEn: string;
  descriptionMs: string;
  coordinates: Coordinate;
  rating: number;
  reviewsCount: number;
  image: string;
  reviews: {
    author: string;
    rating: number;
    text: string;
    date: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface CityStat {
  id: string;
  title: { th: string; en: string; ms: string };
  value: string;
  unit: { th: string; en: string; ms: string };
  change: string;
  trend: "up" | "down" | "neutral";
  color: string;
  category: "infrastructure" | "environment" | "social" | "economic";
}

export interface OpenDataset {
  id: string;
  title: { th: string; en: string; ms: string };
  description: { th: string; en: string; ms: string };
  category: string;
  fileSize: string;
  downloads: number;
  lastUpdated: string;
  format: "CSV" | "PDF";
}

export interface MapMarker {
  id: string;
  title: { th: string; en: string; ms: string };
  type: "school" | "hospital" | "police" | "office" | "complaint";
  coordinates: Coordinate;
  address: { th: string; en: string; ms: string };
  status?: string;
}
