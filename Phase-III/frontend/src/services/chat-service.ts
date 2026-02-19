// frontend/src/services/chat-service.ts
import apiClient from '../lib/api-client';

interface ChatMessageRequest {
  message: string;
  conversation_id?: string;
}

interface ChatMessageResponse {
  conversation_id: string;
  message_id: string;
  role: string;
  content: string;
  timestamp: string;
}

export const sendMessageToChat = async (
  message: string,
  conversationId?: string
): Promise<ChatMessageResponse> => {
  try {
    const payload: ChatMessageRequest = { message };
    if (conversationId) {
      payload.conversation_id = conversationId;
    }

    const response = await apiClient.post('/chat/message', payload);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Chat API request failed: ${response.status}, detail: ${errorData.detail || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error sending message to chat:', error);
    throw error;
  }
};
