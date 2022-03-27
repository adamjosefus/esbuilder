/**
 * @author Adam Josefus
 */


import { join, dirname, fromFileUrl, normalize, relative } from 'https://deno.land/std@0.132.0/path/mod.ts';
import { gray, bold } from "https://deno.land/std@0.132.0/fmt/colors.ts";


const __dirname = dirname(fromFileUrl(import.meta.url));
const root = join(__dirname, '..');

const builderName = 'builder.ts';
const outputName = (os => {
    switch (os) {
        case 'darwin': return 'builder.macos';
        case 'windows': return 'builder.exe';
        case 'linux': return 'builder.linux';
    }
})(Deno.build.os)

const builderFile = relative(Deno.cwd(), normalize(join(root, builderName)));
const outputFile = relative(Deno.cwd(), normalize(join(root, outputName)));



const cmd = [
    `deno`,
    `compile`,
    `--output=${outputFile}`,
    `${builderFile}`
];

console.log("\n");
console.log(bold(`Compile to ${outputName}`));
console.log(gray(`> ${cmd.join(' ')}`));

const process = await Deno.run({
    cmd: cmd,
    stdout: 'piped',
    stderr: 'piped',
})


const { success } = await process.status();

if (success) {
    console.log(gray(`> Succeed`));
} else {
    console.log(gray(`> Failed`));
}

console.log("\n");