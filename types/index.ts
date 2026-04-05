
export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface PostData {
  id: string;
  title: string;
  content: string;
  contentType: string;
  status: 'idea' | 'draft' | 'review' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: Date;
  platforms: Array<{
    name: string;
    status: 'pending' | 'published' | 'failed';
  }>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  businessId: string;
  userId: string;
  media?: Array<{
    type: 'image' | 'video' | 'gif' | 'audio' | 'document';
    url: string;
  }>;
}

export interface BusinessData {
    _id: string;
    name: string;
    userId: string;
}
