import messages from './messages.json';

type MessageKey = keyof typeof messages;

export function usePDFTranslations(namespace?: string) {
    const t = (key: string) => {
        if (!namespace) {
            // @ts-ignore
            return messages[key];
        }
        // @ts-ignore
        const value = messages[namespace]?.[key];
        return value || key;
    };

    return t;
}
