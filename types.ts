
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: string;
  publishedTime: string;
  description?: string;
}

export interface AIRecommendation {
  query: string;
  reason: string;
}

export enum AppTab {
  HOME = 'home',
  TRENDING = 'trending',
  LIBRARY = 'library'
}
