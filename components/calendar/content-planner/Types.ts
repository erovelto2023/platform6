export interface PostData {
  id: string;
  title: string;
  content: string; // Unified field name
  description?: string; // Kept for legacy support
  platforms: string[];
  status: 'idea' | 'draft' | 'review' | 'scheduled' | 'published' | 'failed';
  scheduledAt: Date | null;
  image: string;
  contentType: string;
  workflowStage: string;
  priority: 'low' | 'medium' | 'high' | 'critical'; // Normalized to lowercase
  calendarColor: string;
  time?: string;
  timeAgo?: string;
  businessId?: string;
  userId?: string;
}
