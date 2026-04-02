const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';

const SYSTEM_INSTRUCTION = `
You are ChimDoo's AI Chef Assistant. ChimDoo is a mobile application with 4 main tabs:
1. Home: An interactive 3D globe map showing food recipes around the world based on location.
2. Recipes: A catalog of recipes categorized into groups like Pizza, Tacos, Sushi, Pad Thai, etc. Users can view ingredients, preparation time, and step-by-step instructions.
3. Community: A social feed where users post their food reviews, photos, and like/comment on others' posts.
4. Profile: Where users can edit their display name, profile photo, and view their app version.

You are an expert chef and an expert in the ChimDoo app layout.
If the user asks where a feature is, guide them to the correct tab.
If the user asks for food recommendations based on taste (e.g., salty, sweet, spicy, sour), suggest 2-3 specific dishes and briefly explain why they match the taste profile.

CRITICAL RULES:
- Keep your answers concise, friendly, and helpful.
- ALWAYS reply in the exact SAME LANGUAGE that the user used (e.g., if they ask in Thai, reply in Thai. If they ask in English, reply in English).
- STICK TO THAI AND ENGLISH ONLY. Do NOT use Chinese, Japanese, or any other languages not supported by the app's font to avoid character rendering issues (tofu blocks).
- Do NOT use Markdown syntax for bold text (like **bold**). Just use plain text with emojis and clear new lines.
`;

export type Message = {
    id: string;
    text: string;
    isUser: boolean;
};

let groqHistory: { role: string; content: string }[] = [];
let uiMessages: Message[] = [];

export const getUIMessages = () => uiMessages;

export const initOrRestoreChat = (
    systemInstruction: string = SYSTEM_INSTRUCTION,
    initialMessage: string = 'Loading message...'
) => {
    if (groqHistory.length > 0 && uiMessages.length > 0) {
        return;
    }

    groqHistory = [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: 'สวัสดีครับ คุณคือใครและทำอะไรได้บ้าง?' },
        { role: 'assistant', content: initialMessage }
    ];

    uiMessages = [
        { id: '1', text: initialMessage, isUser: false }
    ];
};

export const sendMessageToGroq = async (text: string) => {
    groqHistory.push({ role: 'user', content: text });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqHistory,
            temperature: 0.7,
        })
    });

    const data = await response.json();

    if (!response.ok) {
        groqHistory.pop();
        throw new Error(data.error?.message || "Unknown Groq API Error");
    }

    const replyContent = data.choices?.[0]?.message?.content || "";
    groqHistory.push({ role: 'assistant', content: replyContent });

    return replyContent;
};

export const clearChatHistory = () => {
    groqHistory = [];
    uiMessages = [];
};
