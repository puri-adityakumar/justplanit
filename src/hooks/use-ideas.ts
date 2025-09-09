import { useState, useEffect, useCallback } from 'react';
import { IdeaService } from '@/services/ideaService';
import { 
  IdeaDocument, 
  CompleteIdea, 
  CreateIdeaRequest,
  UpdateIdeaAnalysisRequest,
  CreateSectionRequest,
  SectionType
} from '@/types/database';
import { useAuth } from './use-auth';

export function useIdeas() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<IdeaDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's ideas
  const loadUserIdeas = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const userIdeas = await IdeaService.listUserIdeas(user.$id);
      setIdeas(userIdeas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create new idea
  const createIdea = useCallback(async (request: Omit<CreateIdeaRequest, 'user_id' | 'user_name'>) => {
    if (!user) throw new Error('User not authenticated');

    setError(null);
    try {
      const newIdea = await IdeaService.createIdea({
        ...request,
        user_id: user.$id,
        user_name: user.name || user.email || 'Anonymous'
      });
      
      // Add to local state
      setIdeas(prev => [newIdea, ...prev]);
      return newIdea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create idea';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user]);

  // Update idea
  const updateIdea = useCallback(async (ideaId: string, updates: Partial<IdeaDocument>) => {
    setError(null);
    try {
      const updatedIdea = await IdeaService.updateIdea(ideaId, updates);
      
      // Update local state
      setIdeas(prev => prev.map(idea => 
        idea.$id === ideaId ? updatedIdea : idea
      ));
      return updatedIdea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update idea';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete idea
  const deleteIdea = useCallback(async (ideaId: string) => {
    setError(null);
    try {
      await IdeaService.deleteIdea(ideaId);
      
      // Remove from local state
      setIdeas(prev => prev.filter(idea => idea.$id !== ideaId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete idea';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Load ideas on mount
  useEffect(() => {
    loadUserIdeas();
  }, [loadUserIdeas]);

  return {
    ideas,
    loading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
    refetch: loadUserIdeas
  };
}

export function useIdeaBySlug(slug?: string) {
  const [idea, setIdea] = useState<CompleteIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load complete idea by slug
  const loadIdea = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    try {
      const ideaDoc = await IdeaService.getIdeaBySlug(slug);
      if (ideaDoc) {
        const completeIdea = await IdeaService.getCompleteIdea(ideaDoc.$id);
        setIdea(completeIdea);
      } else {
        setIdea(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load idea');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Create new idea with specific slug
  const createIdeaWithSlug = useCallback(async (title: string, description: string, userId: string, userName: string) => {
    if (!slug) throw new Error('No slug provided');

    setError(null);
    try {
      // Create the idea with the IdeaService, then manually set its slug
      const newIdea = await IdeaService.createIdea({
        user_id: userId,
        user_name: userName,
        title,
        description
      });

      // Update the idea with the desired slug
      await IdeaService.updateIdea(newIdea.$id, {
        slug: parseInt(slug)
      });

      // Load the complete idea
      const completeIdea = await IdeaService.getCompleteIdea(newIdea.$id);
      setIdea(completeIdea);
      return completeIdea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create idea';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [slug]);

  // Update analysis
  const updateAnalysis = useCallback(async (request: Omit<UpdateIdeaAnalysisRequest, 'idea_id'>) => {
    if (!idea?.idea.$id) throw new Error('No idea loaded');

    setError(null);
    try {
      const analysis = await IdeaService.upsertAnalysis({
        ...request,
        idea_id: idea.idea.$id
      });
      
      // Update local state
      setIdea(prev => prev ? { ...prev, analysis } : null);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [idea?.idea.$id]);

  // Update section
  const updateSection = useCallback(async (sectionType: SectionType, data: Record<string, unknown>) => {
    if (!idea?.idea.$id) throw new Error('No idea loaded');

    setError(null);
    try {
      await IdeaService.upsertSection({
        idea_id: idea.idea.$id,
        section_type: sectionType,
        data
      });
      
      // Update local state
      setIdea(prev => prev ? {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionType]: data
        }
      } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update section';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [idea?.idea.$id]);

  // Load idea on mount or when slug changes
  useEffect(() => {
    loadIdea();
  }, [loadIdea]);

  return {
    idea,
    loading,
    error,
    updateAnalysis,
    updateSection,
    createIdeaWithSlug,
    refetch: loadIdea
  };
}

export function useIdeaDetail(ideaId?: string) {
  const [idea, setIdea] = useState<CompleteIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load complete idea with all sections
  const loadIdea = useCallback(async () => {
    if (!ideaId) return;
    
    setLoading(true);
    setError(null);
    try {
      const completeIdea = await IdeaService.getCompleteIdea(ideaId);
      setIdea(completeIdea);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load idea');
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  // Update analysis
  const updateAnalysis = useCallback(async (request: Omit<UpdateIdeaAnalysisRequest, 'idea_id'>) => {
    if (!ideaId) throw new Error('No idea ID provided');

    setError(null);
    try {
      const analysis = await IdeaService.upsertAnalysis({
        ...request,
        idea_id: ideaId
      });
      
      // Update local state
      setIdea(prev => prev ? { ...prev, analysis } : null);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [ideaId]);

  // Update section
  const updateSection = useCallback(async (sectionType: SectionType, data: Record<string, unknown>) => {
    if (!ideaId) throw new Error('No idea ID provided');

    setError(null);
    try {
      await IdeaService.upsertSection({
        idea_id: ideaId,
        section_type: sectionType,
        data
      });
      
      // Update local state
      setIdea(prev => prev ? {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionType]: data
        }
      } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update section';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [ideaId]);

  // Load idea on mount or when ideaId changes
  useEffect(() => {
    loadIdea();
  }, [loadIdea]);

  return {
    idea,
    loading,
    error,
    updateAnalysis,
    updateSection,
    refetch: loadIdea
  };
}
