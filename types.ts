// Fix: Add the missing 'View' enum.
export enum View {
  Chat = 'Chat',
  Image = 'Image',
  Search = 'Search',
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface GroundedMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingChunk[];
}
