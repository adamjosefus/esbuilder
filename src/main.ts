/**
 * @author Adam Josefus
 */

import { join, isAbsolute, dirname } from "./libs/path.ts";
import { Arguments, InfoInterruption, ExpectedException } from "./libs/allo_arguments.ts";
import { BuilderManager } from "./BuilderManager.ts";
import { makeAbsolute } from "./makeAbsolute.ts";
import { renderVerion, currentVersion } from "./version.ts";


function getArguments() {
    const configConvertor = (v: string | null): string => {
        if (v === null) throw new ExpectedException(`Path to config file is not set.`);

        const path = isAbsolute(v) ? v : join(Deno.cwd(), v);

        try {
            const info = Deno.statSync(path);
            if (!info.isFile) throw new ExpectedException(`${path} is not a file`);

            return path;

        } catch (err) {
            if (!Arguments.isPrintableException(err)) {
                throw new ExpectedException(`Path "${v}" is not exists.`);
            } else {
                throw err;
            }
        }
    };

    const booleanConvertor = (v: boolean | string | null): boolean | null => {
        if (v === true || v?.toString().toLowerCase() === 'true') return true;
        if (v === false || v?.toString().toLowerCase() === 'false') return false;

        return null;
    }

    const args = new Arguments(
        {
            name: 'version, v',
            description: 'Print version.',
            convertor: booleanConvertor,
            default: false,
        },
        {
            name: 'config, c',
            description: 'Path to config file',
            convertor: configConvertor,
        },
        {
            name: 'watch',
            description: 'Watch config file and entry files for changes.',
            convertor: booleanConvertor,
        },
    );

    args.setDescription(`CLI for bulding, bundling and minify Typescript files.`);


    // Important for `--help` flag works.
    if (args.shouldHelp()) args.triggerHelp();
    
    const version = args.get<boolean>('version');

    if (version) {
        throw new InfoInterruption([
            `Version: ${renderVerion(currentVersion)}`,
            `Deno: ${Deno.version.deno}`,
            `TypeScript: ${Deno.version.typescript}`,
        ].join('\n'));
    }

    const configPath = args.get<string>('config');
    const watchOverride = args.get<boolean>('watch');

    return {
        configPath,
        watchOverride,
    }
}


async function watchConfigFile(path: string, manager: BuilderManager) {
    const watcher = Deno.watchFs(path);
    
    if (Deno.build.os !== "windows") {
        Deno.addSignalListener("SIGINT", () => watcher.close());
    }

    let timeouter: number | null = null;

    for await (const _event of watcher) {
        if (timeouter !== null) clearTimeout(timeouter);

        timeouter = setTimeout(async () => {
            try {
                await manager.reCreate();
            } catch (error) {
                Arguments.rethrowUnprintableException(error);
            }
        }, 100);
    }
}


export async function runBuilder() {
    try {
        const args = getArguments();
        const root = makeAbsolute(Deno.cwd(), dirname(args.configPath));
        const manager = new BuilderManager(root, args.configPath, args.watchOverride);
        const config = await manager.create();

        if (config.options.watch) {
            watchConfigFile(args.configPath, manager);
        }
    } catch (error) {
        Arguments.rethrowUnprintableException(error);
        Deno.exit(1);
    }
}
