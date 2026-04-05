export interface PostData {
  id: string;
  title: string;
  description?: string;
  platforms: string[];
  status: 'Draft' | 'Scheduled' | 'Published' | 'Failed' | 'idea' | 'scheduled' | 'draft';
  scheduledAt: Date | null;
  image: string;
  contentType: string;
  workflowStage: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  calendarColor: string;
  time?: string;
  timeAgo?: string;
  // Specific to platform6
  businessId?: string;
  userId?: string;
}
