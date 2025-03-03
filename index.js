#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");

const vaultsJson = path.resolve(__dirname, "vaults.json");
console.log(vaultsJson);

function loadPaths() {
    console.log("here?");
    if (fs.existsSync(vaultsJson)) {
        const data = fs.readFileSync(vaultsJson);

        return JSON.parse(data).paths;
    }
    return [];
}

function saveVault(path, vaultName) {
    vaults.push({ path: path, vaultName: vaultName });
    fs.writeFileSync(vaultsJson, JSON.stringify({ paths: vaults }, null, 2));
}

program
    .version("1.0.0")
    .description("An Obsidian CLI helper tool.")
    .option("-n, --name <type>", "Add your name")
    .action((options) => {
        console.log(`Hey, ${options.name}!`);
    });
const vaults = loadPaths();
saveVault("testpath", "testname");
console.log(vaults[0].path);
//savePath("test/path");
program.parse(process.argv);
