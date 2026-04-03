export type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export interface UIMessage {
    id: string;
    text: string;
    isUser: boolean;
}

export interface Palette {
    primary: string;
    secondary: string;
    accent: string;
    gradient: [string, string];
}
