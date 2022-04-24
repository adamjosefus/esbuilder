export const currentVersion = "1.0.2";
export const lastSupportedVersion = "1.0";


export function renderVerion(version: string): string {
    const parts = version.trim().split('.').map(v => parseInt(v, 10));

    while (parts.length < 3) {
        parts.push(0);
    }

    return parts.join('.');
}
