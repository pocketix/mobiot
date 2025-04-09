

export function removeComma(text: string): string {
    if (text.length >= 2 && text[text.length - 2] === ',') {
        return text.slice(0, text.length - 2) + text[text.length - 1];
    }
    return text;
}