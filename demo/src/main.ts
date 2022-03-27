import { PseudoModuleA } from "./PseudoModuleA.ts";
import { PseudoModuleB } from "./PseudoModuleB.ts";

export function init() {
    console.log("> init");

    const a = new PseudoModuleA();
    console.log(a);
    
    const b = new PseudoModuleB();
    console.log(b);
}
