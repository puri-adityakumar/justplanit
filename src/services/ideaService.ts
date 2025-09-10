import { databases } from '@/lib/appwrite';
import { ID, Query, Models } from 'appwrite';
import { 
  DATABASE_CONFIG,
  IdeaDocument, 
  IdeaAnalysisDocument, 
  IdeaDataSectionDocument,
  CompleteIdea,
  CreateIdeaRequest,
  UpdateIdeaAnalysisRequest,
  CreateSectionRequest,
  UpdateSectionRequest,
  SectionType
} from '@/types/database';

export class IdeaService {
  private static db = DATABASE_CONFIG.DATABASE_ID;
  private static collections = DATABASE_CONFIG.COLLECTIONS;

  // Generate unique slug for ideas
  private static async generateUniqueSlug(): Promise<number> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return parseInt(`${timestamp}${random}`.slice(-8)); // 8 digit number
  }

  // Create a new idea
  static async createIdea(request: CreateIdeaRequest): Promise<IdeaDocument> {
    const slug = await this.generateUniqueSlug();

    const ideaData = {
      user_id: request.user_id,
      user_name: request.user_name,
      title: request.title || null,
      description: request.description || null,
      slug,
      status: 'analyzing' as const,
      is_public: false
      // Appwrite automatically adds $createdAt and $updatedAt
    };

    const response = await databases.createDocument(
      this.db,
      this.collections.IDEAS,
      ID.unique(),
      ideaData
    );

    return response as unknown as IdeaDocument;
  }

  // Get idea by ID
  static async getIdea(ideaId: string): Promise<IdeaDocument> {
    const response = await databases.getDocument(
      this.db,
      this.collections.IDEAS,
      ideaId
    );
    return response as unknown as IdeaDocument;
  }

    // Get idea by slug
  static async getIdeaBySlug(slug: string): Promise<IdeaDocument | null> {
    try {
      const response = await databases.listDocuments(
        this.db,
        this.collections.IDEAS,
        [Query.equal('slug', parseInt(slug))]
      );
      
      return response.documents.length > 0 
        ? response.documents[0] as unknown as IdeaDocument
        : null;
    } catch (err) {
      console.error('Error fetching idea by slug:', err);
      return null;
    }
  }

  // Get complete idea with all related data
  static async getCompleteIdea(ideaId: string): Promise<CompleteIdea> {
    // Get main idea
    const idea = await this.getIdea(ideaId);

    // Get analysis
    let analysis: CompleteIdea['analysis'] | undefined;
    try {
      const analysisResponse = await databases.listDocuments(
        this.db,
        this.collections.IDEA_ANALYSIS,
        [Query.equal('idea_id', ideaId)]
      );
      if (analysisResponse.documents.length > 0) {
        const rawAnalysis = analysisResponse.documents[0] as unknown as IdeaAnalysisDocument;
        analysis = {
          $id: rawAnalysis.$id,
          idea_id: rawAnalysis.idea_id,
          status: rawAnalysis.status,
          viability_score: rawAnalysis.viability_score,
          market_size: rawAnalysis.market_size,
          result: rawAnalysis.result ? JSON.parse(rawAnalysis.result) : undefined,
          error: rawAnalysis.error,
          completed_at: rawAnalysis.completed_at,
          created_at: rawAnalysis.$createdAt,
          updated_at: rawAnalysis.$updatedAt
        };
      }
    } catch (error) {
      console.log('No analysis found for idea:', ideaId);
    }

    // Get all sections
    const sectionsResponse = await databases.listDocuments(
      this.db,
      this.collections.IDEA_DATA_SECTIONS,
      [Query.equal('idea_id', ideaId)]
    );

    // Parse sections into object
    const sections: Partial<Record<SectionType, unknown>> = {};
    sectionsResponse.documents.forEach((doc) => {
      const sectionDoc = doc as unknown as IdeaDataSectionDocument;
      try {
        sections[sectionDoc.section_type] = JSON.parse(sectionDoc.data);
      } catch (error) {
        console.error(`Failed to parse section ${sectionDoc.section_type}:`, error);
        sections[sectionDoc.section_type] = null;
      }
    });

    return {
      idea,
      analysis,
      sections
    };
  }

  // List ideas for a user
  static async listUserIdeas(userId: string): Promise<IdeaDocument[]> {
    const response = await databases.listDocuments(
      this.db,
      this.collections.IDEAS,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt')
      ]
    );
    return response.documents as unknown as IdeaDocument[];
  }

  // Update idea
  static async updateIdea(ideaId: string, updates: Partial<Omit<IdeaDocument, '$createdAt' | '$updatedAt'>>): Promise<IdeaDocument> {
    const response = await databases.updateDocument(
      this.db,
      this.collections.IDEAS,
      ideaId,
      updates
    );
    return response as unknown as IdeaDocument;
  }

  // Create or update analysis
  static async upsertAnalysis(request: UpdateIdeaAnalysisRequest): Promise<CompleteIdea['analysis']> {
    // Check if analysis exists
    const existingResponse = await databases.listDocuments(
      this.db,
      this.collections.IDEA_ANALYSIS,
      [Query.equal('idea_id', request.idea_id)]
    );

    const analysisData = {
      idea_id: request.idea_id,
      status: request.status || 'analyzing',
      viability_score: request.viability_score || null,
      market_size: request.market_size || null,
      result: request.result ? JSON.stringify(request.result) : null,
      error: request.error || null,
      completed_at: request.completed_at || null
      // Appwrite automatically manages $createdAt and $updatedAt
    };

    let response: Models.Document;
    if (existingResponse.documents.length > 0) {
      // Update existing
      response = await databases.updateDocument(
        this.db,
        this.collections.IDEA_ANALYSIS,
        existingResponse.documents[0].$id,
        analysisData
      );
    } else {
      // Create new
      response = await databases.createDocument(
        this.db,
        this.collections.IDEA_ANALYSIS,
        ID.unique(),
        analysisData
      );
    }

    const rawAnalysis = response as unknown as IdeaAnalysisDocument;
    
    // Return parsed format
    return {
      $id: rawAnalysis.$id,
      idea_id: rawAnalysis.idea_id,
      status: rawAnalysis.status,
      viability_score: rawAnalysis.viability_score,
      market_size: rawAnalysis.market_size,
      result: rawAnalysis.result ? JSON.parse(rawAnalysis.result) : undefined,
      error: rawAnalysis.error,
      completed_at: rawAnalysis.completed_at,
      created_at: rawAnalysis.$createdAt,
      updated_at: rawAnalysis.$updatedAt
    };
  }

  // Create or update section data
  static async upsertSection(request: CreateSectionRequest): Promise<IdeaDataSectionDocument> {
    // Check if section exists
    const existingResponse = await databases.listDocuments(
      this.db,
      this.collections.IDEA_DATA_SECTIONS,
      [
        Query.equal('idea_id', request.idea_id),
        Query.equal('section_type', request.section_type)
      ]
    );

    const sectionData = {
      idea_id: request.idea_id,
      section_type: request.section_type,
      data: JSON.stringify(request.data)
      // Appwrite automatically manages $createdAt and $updatedAt
    };

    if (existingResponse.documents.length > 0) {
      // Update existing
      const response = await databases.updateDocument(
        this.db,
        this.collections.IDEA_DATA_SECTIONS,
        existingResponse.documents[0].$id,
        sectionData
      );
      return response as unknown as IdeaDataSectionDocument;
    } else {
      // Create new
      const response = await databases.createDocument(
        this.db,
        this.collections.IDEA_DATA_SECTIONS,
        ID.unique(),
        sectionData
      );
      return response as unknown as IdeaDataSectionDocument;
    }
  }

  // Delete idea and all related data
  static async deleteIdea(ideaId: string): Promise<void> {
    // Delete sections
    const sectionsResponse = await databases.listDocuments(
      this.db,
      this.collections.IDEA_DATA_SECTIONS,
      [Query.equal('idea_id', ideaId)]
    );

    for (const section of sectionsResponse.documents) {
      await databases.deleteDocument(
        this.db,
        this.collections.IDEA_DATA_SECTIONS,
        section.$id
      );
    }

    // Delete analysis
    const analysisResponse = await databases.listDocuments(
      this.db,
      this.collections.IDEA_ANALYSIS,
      [Query.equal('idea_id', ideaId)]
    );

    for (const analysis of analysisResponse.documents) {
      await databases.deleteDocument(
        this.db,
        this.collections.IDEA_ANALYSIS,
        analysis.$id
      );
    }

    // Delete main idea
    await databases.deleteDocument(
      this.db,
      this.collections.IDEAS,
      ideaId
    );
  }

  // Get ideas by status
  static async getIdeasByStatus(status: 'analyzing' | 'completed' | 'failed'): Promise<IdeaDocument[]> {
    const response = await databases.listDocuments(
      this.db,
      this.collections.IDEAS,
      [
        Query.equal('status', status),
        Query.orderDesc('$createdAt')
      ]
    );
    return response.documents as unknown as IdeaDocument[];
  }

  // Get public ideas
  static async getPublicIdeas(): Promise<IdeaDocument[]> {
    const response = await databases.listDocuments(
      this.db,
      this.collections.IDEAS,
      [
        Query.equal('is_public', true),
        Query.equal('status', 'completed'),
        Query.orderDesc('$createdAt')
      ]
    );
    return response.documents as unknown as IdeaDocument[];
  }
}
