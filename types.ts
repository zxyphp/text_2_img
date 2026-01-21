export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface ImageGenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  styleId?: string;
}

export interface GeneratedImage {
  id: string;
  url: string; // Data URL
  prompt: string; // The user's original prompt
  styleId: string;
  styleLabel: string;
  aspectRatio: AspectRatio;
  createdAt: number;
}

export interface GeminiError {
  message: string;
  code?: string;
}
