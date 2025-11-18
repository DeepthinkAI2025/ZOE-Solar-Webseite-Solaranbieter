export interface GMBReview {
  reviewId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  publishTime: string;
  reply?: {
    comment: string;
    publishTime: string;
  };
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
}

export interface GMBQuestion {
  questionId: string;
  question: string;
  authorName: string;
  publishTime: string;
  answer?: {
    text: string;
    publishTime: string;
  };
  status: 'unanswered' | 'answered' | 'auto_answered';
}

export interface GMBPostAnalytics {
  postId: string;
  views: number;
  clicks: number;
  engagement: number;
  reach: number;
  period: { startDate: string; endDate: string };
}

export interface GMBCompetitor {
  name: string;
  placeId: string;
  rating: number;
  reviewCount: number;
  position: number;
  keywords: string[];
}

export interface GMBReport {
  locationId: string;
  period: { startDate: string; endDate: string };
  summary: {
    totalViews: number;
    totalActions: number;
    averageRating: number;
    totalReviews: number;
    topKeywords: Array<{ keyword: string; impressions: number; position: number }>;
  };
  insights: string[];
  recommendations: string[];
}

export interface GMBContentCalendar {
  locationId: string;
  posts: Array<{
    id: string;
    scheduledDate: string;
    type: 'update' | 'event' | 'offer' | 'product';
    title: string;
    content: string;
    keywords: string[];
    status: 'draft' | 'scheduled' | 'published';
  }>;
}

export interface GMBAlert {
  id: string;
  type: 'review' | 'question' | 'performance' | 'competitor';
  severity: 'low' | 'medium' | 'high';
  message: string;
  locationId: string;
  timestamp: string;
  resolved: boolean;
}