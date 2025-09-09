import { Models } from 'appwrite';

// Database schema types for the normalized structure

export interface IdeaDocument extends Models.Document {
  user_id: string;
  user_name: string;
  title?: string;
  description?: string;
  slug?: number;
  status: 'analyzing' | 'completed' | 'failed';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface IdeaAnalysisDocument extends Models.Document {
  idea_id: string;
  viability_score?: number;
  market_size?: string;
  created_at: string;
  updated_at: string;
}

export type SectionType = 
  | 'overview' 
  | 'prd' 
  | 'tech_stack' 
  | 'cost_analysis' 
  | 'roadmap' 
  | 'design_system' 
  | 'workflows' 
  | 'ai_context';

export interface IdeaDataSectionDocument extends Models.Document {
  idea_id: string;
  section_type: SectionType;
  data: string; // JSON string
  created_at: string;
  updated_at: string;
}

// Complete idea with all related data
export interface CompleteIdea {
  idea: IdeaDocument;
  analysis?: IdeaAnalysisDocument;
  sections: Partial<Record<SectionType, unknown>>; // Parsed JSON data
}

// Database service response types
export interface CreateIdeaRequest {
  user_id: string;
  user_name: string;
  title?: string;
  description?: string;
}

export interface UpdateIdeaAnalysisRequest {
  idea_id: string;
  viability_score?: number;
  market_size?: string;
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
  DATABASE_ID: '68c0517a0014c38c2a50',
  COLLECTIONS: {
    IDEAS: 'ideas',
    IDEA_ANALYSIS: 'idea_analysis', 
    IDEA_DATA_SECTIONS: 'idea_data_sections'
  }
} as const;
