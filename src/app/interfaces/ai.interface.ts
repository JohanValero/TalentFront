export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIResponse {
  isDownloadable: boolean;
  bot_response: string;
  pdf_file: any;
}

export interface AIPayload {
    original_data: any;
    user_prompt: string;
    chat_history: ChatMessage[];
  }
