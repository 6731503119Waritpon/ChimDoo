import { UIMessage } from "./common";

export interface TypewriterTextProps {
    text: string;
    isLatest: boolean;
}

export interface ChatMessageProps {
    item: UIMessage;
    isNew: boolean;
    isLatestAI: boolean;
}
