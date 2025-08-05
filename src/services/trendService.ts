import { api } from './api';
import { ArchiveTagDto } from './archiveTagService';

export interface TrendPoint {
  timestamp: string;
  value: number;
}

export interface TrendResponse {
  points: TrendPoint[];
}

export const trendService = {
  get: (tag: ArchiveTagDto, start: string, end: string) =>
    api.post<TrendResponse>(
      `/api/archivetags/${tag.id}/trend`,
      { start, end }
    ),
};

