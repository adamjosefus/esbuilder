/**
 * @author Adam Josefus
 */

export function exists(path: string): boolean {
    try {
        Deno.statSync(path);
        return true;
    } catch (_error) {
        return false;
    }
}