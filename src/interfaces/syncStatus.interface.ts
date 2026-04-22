export interface SyncStatusResponse {
  id: number;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  totalFetched: number;
  totalUpserted: number;
  totalFailed: number;
  retryCount: number;
  errorSummary: string | null;
  createdAt: string;
  updatedAt: string;
}
