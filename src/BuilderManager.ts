/**
 * @author Adam Josefus
 */

import { ValueException } from "https://deno.land/x/allo_arguments@v5.0.2/mod.ts";
import { BuilderCore } from "./BuilderCore.ts";
import { exists } from "./exists.ts";
import { makeAbsolute } from "./makeAbsolute.ts";
import { ConfigType, parseConfig } from "./parseConfig.ts";
import * as print from "./stylePrint.ts";


class BuilderManagerException extends Error {
}


export class BuilderManager {

    #root: string;
    #configPath: string;
    #watchOverride: boolean;

    #builder: BuilderCore | null = null;

    constructor(root: string, configPath: string, watchOverride: boolean) {
        this.#root = root;
        this.#configPath = configPath;
        this.#watchOverride = watchOverride;
    }


    async create(): Promise<ConfigType> {
        if (this.#builder) {
            throw new BuilderManagerException("Builder already started");
        }

        if (!exists(this.#configPath)) {
            throw new ValueException(`Config file "${this.#configPath}" is not exists.`);
        }

        const json = await Deno.readTextFile(this.#configPath);
        const config = parseConfig(this.#root, json, this.#watchOverride);

        const entryPoints = this.#createEndpoints(config);

        this.#builder = new BuilderCore(entryPoints, config);
        await this.#builder.start();

        return config;
    }


    async destroy() {
        if (!this.#builder) {
            throw new BuilderManagerException("Builder not started");
        }

        this.#builder.stop();
        this.#builder = null;

        return await new Promise<void>(resolve => {
            setTimeout(() => resolve(), 200);
        });
    }


    async reCreate() {
        try {
            await this.destroy();
        } catch (err) {
            if (!(err instanceof BuilderManagerException)) throw err;
        }

        print.note`Config changed.Recreating builder...`;
        print.text``;

        try {
            await this.create();
        } catch (err) {
            if (!(err instanceof BuilderManagerException)) throw err;
        }
    }


    #createEndpoints(config: ConfigType): string[] {
        return config.files
            .map(f => f.path.trim())
            .filter((v, i, a) => a.indexOf(v) === i)
            .map(path => makeAbsolute(config.sourceDir, path));
    }
}