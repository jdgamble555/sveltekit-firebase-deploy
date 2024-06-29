export const getOriginFromUrl = (url: string): string => {
    const [protocol, , host] = url.split('/');
    return `${protocol}//${host}`;
};

// Get underlying body if available. Works for text and json bodies.
export const getBodyContent = async (req: Request): Promise<BodyInit | null | undefined> => {
    if (req.method === 'GET') return null;

    try {
        if (req.headers.get('Content-Type')?.includes('json')) {
            const json = await req.json();
            return JSON.stringify(json);
        }
        return await req.text();
    } catch {
        return null;
    }
};