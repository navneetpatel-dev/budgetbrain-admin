export interface AiConversation {
  id: string;
  userId: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  user?: { email: string; name: string | null };
}

export interface AiUsageResponse {
  conversations: AiConversation[];
  total: number;
  page: number;
  limit: number;
}
