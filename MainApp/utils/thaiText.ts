export const isLeadingVowel = (char: string) => {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return code >= 0x0E40 && code <= 0x0E44;
};

export const isCombiningMark = (char: string) => {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return (code === 0x0E31) || (code >= 0x0E34 && code <= 0x0E3A) || (code >= 0x0E47 && code <= 0x0E4E);
};

export const segmentThaiText = (text: string) => {
    const segments: string[] = [];
    let i = 0;
    while (i < text.length) {
        let cluster = text[i];
        i++;
        if (isLeadingVowel(cluster) && i < text.length) {
            cluster += text[i];
            i++;
        }
        while (i < text.length && isCombiningMark(text[i])) {
            cluster += text[i];
            i++;
        }
        segments.push(cluster);
    }
    return segments;
};
