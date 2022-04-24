# ESBuilder

Simple and easy to use solution for building your modules to native ES syntax.

You can found this project on [Deno.land registry](https://deno.land/x/esbuilder).

# Installations
1. [Install **Deno 🦕**](https://deno.land/#installation)
2. [Check if your `.deno` folder is in PATH](https://deno.land/manual@v1.19.3/tools/script_installer#script-installer)
3. **Install it!**


## Install from **Deno** *(Simpliest way)*
Run the following command:
```sh
deno install \
 --allow-read \
 --allow-write \
 --allow-env \
 --allow-run \
 --name esbuilder \
 https://deno.land/x/esbuilder/builder.ts
```


## Install by **VSCode** task runner *(No terminal way)*
- Clone this repository
- Open repo in VS Code
- Open Command Pallete _(`Ctrl + Shift + P` / `⌘ + Shift + P`)_
    - Select → `Tasks: Run Task`
    - **Run → `Install ESBuilder`**


## Install in **Terminal**  from Repository
- Clone this repository
- Run the following command:
- 
```sh
deno install \
 --allow-read \
 --allow-write \
 --allow-env \
 --allow-run \
 --allow-net \
 --no-prompt \
 --name esbuilder \
 ./builder.ts
```

## Uninstallations
Simple!
```sh
deno uninstall esbuilder
```

# Usage
```sh
esbuilder --config=./config.json
```


## Help
```sh
esbuilder --help
```


### Alternative
```sh
deno run --allow-all ./builder.ts --config=./config.json
deno run --allow-all ./builder.bundled.js --config=./config.json
```

# Configuration

## Example
```json
{
    "version": "1.0",
    "sourceDir": "./src",
    "outDir": "./dist",
    "files": [
        "./file1.ts",
        "./file2.ts",
    ],
    "build": {
        "bundle": true,
        "minify": true,
        "sourcemap": true
    },
    "options": {
        "watch": true,
        "gitignore": true,
    }
}
```

## Properties

### Version — ***Required***
Version of config schema/syntax.
Defaults to current version of Builder.

```json
{
    "version": "1.0"
}
```

The notation `"1.0"` and `"1.0.0"` are equivalent.


### Source directory — _Optional_
Path to source directory.
Defaults to `./`.

```json
{
    "sourceDir": "./src"
}
```


### Output directory — _Optional_
Path to output directory.
Defaults to `./build`.

```json
{
    "outDir": "./dist"
}
```

### Files / Entry points  — _Optional_
Paths to entry files relative to `sourceDir`.

```json
{
    "files": [
        "./file1.ts",
        "./dir/file2.ts",
    ]
}
```

```json
{
    "files": {
        "MyGroupA": "./file1.ts",
        "MyGroupB": [
            "./file1.ts",
            "./dir/file2.ts"
        ]
    }
}
```

### Build Settings — _Optional_
#### Bundle — _Optional_
Whether to bundle entry file (with dependecies) into a single file.
Defaults to `false`.

```json
{
    "build": {
        "bundle": true
    }
}
```

#### Minify — _Optional_
Whether to minify the output.
Defaults to `false`.
```json
{
    "build": {
        "minify": true
    }
}
```

#### Source Maps — _Optional_
Whether to create source map files.
Defaults to `false`.
```json
{
    "build": {
        "sourcemap": true
    }
}
```

### Options — _Optional_
#### Verbose — _Optional_
Whether to print verbose output.
Defaults to `true`.

```json
{
    "options": {
        "verbose": false
    }
}
```

#### Watch — _Optional_
If `true`, watch for changes in source files and rebuild.
Defaults to `false`.

You can forced by passing `--watch` flag.

```json
{
    "options": {
        "watch": true
    }
}
```

#### tsconfig — _Optional_
Path to [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
Defaults to `null`.

```json
{
    "options": {
        "tsconfig": "./tsconfig.json"
    }
}
```

#### Generate `.gitignore` — _Optional_
Whether to create `.gitignore` with built outputs.
Defaults to `false`.

```json
{
    "options": {
        "gitignore": true
    }
}
```

#### Generate Output summary — _Optional_
Whether to create json file with description of all built outputs.
Defaults to `false`.

```json
{
    "options": {
        "outputSummary": true
    }
}
```

Example I of output summary:
```json
{
    "version": "1.0",
    "files": [
        "./file1.js",
        "./file1.js.map",
        "./dir/file2.js",
        "./dir/file2.js.map"
    ]
}
```

Example II of output summary:
```json
{
    "version": "1.0",
    "files": {
        "MyGroupA": [
            "./file1.js",
            "./file1.js.map"
        ],
        "MyGroupB": [
            "./file1.js",
            "./file1.js.map",
            "./dir/file2.js",
            "./dir/file2.js.map"
        ]
    }
}
```

#### Output Summary Filename — _Optional_
Name of the output summary file.
Defaults to `output-summary.json`.

```json
{
    "options": {
        "outputSummaryFilename": "output-summary.json"
    }
}
```
