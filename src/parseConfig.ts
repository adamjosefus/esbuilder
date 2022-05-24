/**
 * @author Adam Josefus
 */

import { join } from "./libs/path.ts";
import { ValueException } from "./libs/allo_arguments.ts";
import { makeAbsolute } from "./makeAbsolute.ts";
import { currentVersion, lastSupportedVersion, renderVerion } from "./version.ts";


type DataType = {
    /**
     * Version of config schema/syntax.
     */
    version: string,
    /**
     * Path to source directory.
     * Defaults to `./`.
     */
    sourceDir?: string,
    /**
     * Path to output directory.
     * Defaults to `./build`.
     */
    outDir?: string,
    /**
     * Paths to entry files relative to `sourceDir`.
     */
    files?: string[] | Record<string, string | string[]>
    /**
     * Build options.
     */
    build: Partial<{
        /**
         * Whether to bundle entry file (with dependecies) into a single file.
         * Defaults to `false`.
         */
        bundle: boolean,
        /**
         * Whether to minify the output.
         * Defaults to `false`.
         */
        minify: boolean,
        /**
         * Whether to create source map files.
         * Defaults to `false`.
         */
        sourcemap: boolean,
    }>,
    options: Partial<{
        /**
         * Whether to print verbose output.
         * Defaults to `true`.
         */
        verbose: boolean,
        /**
         * If `true`, watch for changes in source files and rebuild.
         * You can forced by passing `--watch` flag.
         */
        watch: boolean,
        /**
         * Path to tsconfig.json.
         * Defaults to `null`.
         */
        tsconfig: string,
        /**
         * Whether to create .gitignore with built outputs.
         * Defaults to `false`.
         */
        gitignore: boolean,
        /**
         * Whether to create `output-summary.json` with all built outputs.
         * Defaults to `false`.
         */
        outputSummary: boolean,
        /**
         * Name of the output summary file.
         * Defaults to `output-summary.json`.
         */
        outputSummaryFilename: string,
    }>,
};


export type ConfigType = {
    version: string,
    sourceDir: string,
    outDir: string,
    files: {
        group?: string,
        path: string,
    }[],
    build: {
        bundle: boolean,
        minify: boolean,
        sourcemap: boolean,
    },
    options: {
        verbose: boolean,
        watch: boolean,
        tsconfig: string | null,
        gitignore: boolean,
        outputSummar: boolean,
        outputSummaryFilename: string,
    }
};


function isConfigVersionValid(version: string, lastSupported: string): boolean {
    const configVersion = version.split('.').map(v => parseInt(v, 10));
    const lastSupportedVersion = lastSupported.split('.').map(v => parseInt(v, 10));

    const length = Math.max(configVersion.length, lastSupportedVersion.length);

    for (let i = 0; i < length; i++) {
        const conf = configVersion.at(i) ?? 0;
        const last = lastSupportedVersion.at(i) ?? 0;

        if (conf > last) return true;
        if (conf < last) return false;
    }

    return true;
}


function isBuilderVersionValid(current: string, config: string): boolean {
    const currentVersion = current.split('.').map(v => parseInt(v, 10)).slice(0, 2);
    const configVersion = config.split('.').map(v => parseInt(v, 10)).slice(0, 2);

    const length = Math.max(currentVersion.length, configVersion.length);

    for (let i = 0; i < length; i++) {
        const curr = currentVersion.at(i) ?? 0;
        const conf = configVersion.at(i) ?? 0;

        if (conf <= curr) return true;
        if (conf > curr) return false;
    }

    return true;
}


export function parseConfig(root: string, json: string, watchOverride: boolean | null): ConfigType {
    const data = (() => {
        try {
            return JSON.parse(json) as DataType
        } catch (err) {
            throw new ValueException(`JSON parse error: ${err.message}`);
        }
    })();

    const files = ((v) => {
        if (Array.isArray(v)) return v.map(path => ({ path }));

        return Object.entries(v).map(([group, p]) => {
            if (Array.isArray(p)) {
                return p.map(path => ({ group, path }));
            } else {
                return { group, path: p };
            }
        }).flat();
    })(data.files ?? []);

    if (!isConfigVersionValid(data.version, lastSupportedVersion)) {
        throw new ValueException([
            `Unsupported config version: "${renderVerion(data.version)}"`,
            `Last Supported version: "${renderVerion(lastSupportedVersion)}"`,
            `Please update your config file.`,
        ].join('\n'));
    }

    if (!isBuilderVersionValid(currentVersion, data.version)) {
        throw new ValueException([
            `Unsupported Builder version: "${renderVerion(currentVersion)}"`,
            `Config version: "${renderVerion(data.version)}"`,
            `Please update your Builder.`,
        ].join('\n'));
    }

    return {
        version: data.version,
        files,
        sourceDir: makeAbsolute(root, data.sourceDir ?? './'),
        outDir: makeAbsolute(root, data.outDir ?? './build'),
        build: {
            bundle: data.build?.bundle ?? false,
            minify: data.build?.minify ?? false,
            sourcemap: data.build?.sourcemap ?? false,
        },
        options: {
            verbose: data.options?.verbose ?? true,
            watch: watchOverride !== null ? watchOverride : (data.options?.watch ?? false),
            tsconfig: data.options?.tsconfig ?? null,
            gitignore: data.options?.gitignore ?? false,
            outputSummar: data.options?.outputSummary ?? false,
            outputSummaryFilename: join('./', data.options?.outputSummaryFilename ?? 'output-summary.json'),
        }
    }
}
