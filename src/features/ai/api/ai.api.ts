import { apiGet } from '@/shared/services/api';
import type { AiUsageResponse } from '../types/ai.types';

export async function getAiUsage(page = 1, limit = 20): Promise<AiUsageResponse> {
  return apiGet<AiUsageResponse>(`/admin/ai-usage?page=${page}&limit=${limit}`);
}
