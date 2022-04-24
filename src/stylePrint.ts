/**
 * @author Adam Josefus
 */

import { bold, italic, gray } from 'https://deno.land/std@0.136.0/fmt/colors.ts';


export function text(template: TemplateStringsArray, ...masks: unknown[]) {
    const s = String.raw(template, ...masks);

    console.log(`${s}`);
}


export function headline(template: TemplateStringsArray, ...masks: unknown[]) {
    const s = String.raw(template, ...masks);

    console.log(`${bold(s)}`);
}


export function bullet(template: TemplateStringsArray, ...masks: unknown[]) {
    const s = String.raw(template, ...masks);

    console.log(`${gray('>')} ${s}`);
}


export function subbullet(template: TemplateStringsArray, ...masks: unknown[]) {
    const s = String.raw(template, ...masks);

    console.log(`${gray('>>')} ${s}`);
}


export function note(template: TemplateStringsArray, ...masks: unknown[]) {
    const s = String.raw(template, ...masks);

    console.log(`${gray(italic(`${s}`))}`);
}



