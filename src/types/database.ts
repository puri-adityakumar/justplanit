import { Models } from 'appwrite';

// Database schema types for the normalized structure

export interface IdeaDocument extends Models.Document {
  user_id: string;
  user_name: string;
  slug?: number;
  status: 'analyzing' | 'completed' | 'failed';
  is_public: boolean;
  // Inherits $createdAt, $updatedAt, $id, $collectionId, $databaseId, $permissions from Models.Document
}

export interface IdeaAnalysisDocument extends Models.Document {
  idea_id: string;
  status?: 'analyzing' | 'completed' | 'failed';
  viability_score?: number;
  market_size?: string;
  completed_at?: string;
  title?: string;
  description?: string;
  // Inherits $createdAt, $updatedAt, $id, $collectionId, $databaseId, $permissions from Models.Document
}

export type SectionType =
  | 'overview'
  | 'prd'
  | 'tech_stack'
  | 'cost_analysis'
  | 'market'
  | 'roadmap'
  | 'design_system'
  | 'workflows'
  | 'ai_context';

export interface IdeaDataSectionDocument extends Models.Document {
  idea_id: string;
  section_type: SectionType;
  data: string; // JSON string
  // Inherits $createdAt, $updatedAt, $id, $collectionId, $databaseId, $permissions from Models.Document
}

// Complete idea with all related data
export interface CompleteIdea {
  idea: IdeaDocument;
  analysis?: {
    $id: string;
    idea_id: string;
    status?: 'analyzing' | 'completed' | 'failed';
    viability_score?: number;
    market_size?: string;
    completed_at?: string;
    title?: string;
    description?: string;
    created_at: string;  // Maps to $createdAt
    updated_at: string;  // Maps to $updatedAt
  };
  sections: Partial<Record<SectionType, unknown>>; // Parsed JSON data
}

// Database service response types
export interface CreateIdeaRequest {
  user_id: string;
  user_name: string;
}

export interface UpdateIdeaAnalysisRequest {
  idea_id: string;
  status?: 'analyzing' | 'completed' | 'failed';
  viability_score?: number;
  market_size?: string;
  completed_at?: string;
  title?: string;
  description?: string;
}

export interface CreateSectionRequest {
  idea_id: string;
  section_type: SectionType;
  data: Record<string, unknown>; // Will be JSON.stringify'd
}

export interface UpdateSectionRequest {
  idea_id: string;
  section_type: SectionType;
  data: Record<string, unknown>; // Will be JSON.stringify'd
}

// API response types
export interface IdeaListResponse {
  ideas: IdeaDocument[];
  total: number;
}

export interface IdeaDetailResponse {
  idea: CompleteIdea;
}

// Database configuration
export const DATABASE_CONFIG = {
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID || '68c0517a0014c38c2a50',
  COLLECTIONS: {
    IDEAS: import.meta.env.VITE_APPWRITE_IDEAS_COLLECTION_ID || 'ideas',
    IDEA_ANALYSIS: import.meta.env.VITE_APPWRITE_ANALYSIS_COLLECTION_ID || 'idea_analysis',
    IDEA_DATA_SECTIONS: import.meta.env.VITE_APPWRITE_SECTIONS_COLLECTION_ID || 'idea_data_sections'
  }
} as const;
