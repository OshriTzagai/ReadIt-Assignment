export interface HNItem {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  descendants?: number;
  time: number;
  type: 'story' | 'job' | 'ask' | 'show' | 'poll' | 'comment';
  kids?: number[];
  dead?: boolean;
  deleted?: boolean;
  text?: string;
}

export interface AuthPayload {
  sub: string;
  iat: number;
  exp: number;
}

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type FeedStatus =
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'paginating'
  | 'succeeded'
  | 'failed';
