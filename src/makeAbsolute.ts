/**
 * @author Adam Josefus
 */

import { join, isAbsolute } from "./libs/path.ts";


export function makeAbsolute(root: string, path: string): string {
    if (isAbsolute(path)) return path;

    return join(root, path);    
}
