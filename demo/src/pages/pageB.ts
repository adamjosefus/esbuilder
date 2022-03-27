import { PseudoModuleB } from "../PseudoModuleB.ts";

export function init() {
    console.log("> pageA init");

    const b = new PseudoModuleB();
    console.log(b);
}
