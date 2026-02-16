import messages from './messages.json';

type MessageKey = keyof typeof messages;

export function usePDFTranslations(namespace?: string) {
    const t = (key: string, params?: Record<string, string | number>) => {
        let value: string = "";
        if (!namespace) {
            // @ts-ignore
            value = messages[key];
        } else {
            // @ts-ignore
            value = messages[namespace]?.[key];
        }

        value = value || key;

        if (params && typeof value === 'string') {
            Object.entries(params).forEach(([k, v]) => {
                value = value.replace(new RegExp(`{${k}}`, 'g'), String(v));
            });
        }

        return value;
    };

    return t;
}
