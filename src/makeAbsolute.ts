/**
 * @author Adam Josefus
 */

import { join, isAbsolute } from "https://deno.land/std@0.136.0/path/mod.ts";


export function makeAbsolute(root: string, path: string): string {
    if (isAbsolute(path)) return path;

    return join(root, path);    
}
