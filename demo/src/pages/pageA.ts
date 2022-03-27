import { PseudoModuleA } from "../PseudoModuleA.ts";

export function init() {
    console.log("> pageA init");

    const a = new PseudoModuleA();
    console.log(a);
}
