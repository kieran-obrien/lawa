#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");

const settingsJson = path.resolve(__dirname, "settings.json");

const vaults = loadPaths();
const vaultNames = vaults.map((vault) => vault.vaultName);

function loadPaths() {
    if (fs.existsSync(settingsJson)) {
        const settingsData = fs.readFileSync(settingsJson);
        return JSON.parse(settingsData).vaults;
    }
    return [];
}

function saveVault(path, vaultName) {
    // Check for dupe names
    for (let entry of vaults) {
        if (entry.vaultName === vaultName) {
            console.log(
                "Error: Vault name already taken. Please provide a unique identifier."
            );
            return;
        }
    }
    vaults.push({ path: path, vaultName: vaultName, activeVault: false });
    fs.writeFileSync(settingsJson, JSON.stringify({ vaults: vaults }, null, 2));
}

program
    .version("1.0.0")
    .description("An Obsidian CLI helper tool.")
    .action((options) => {
        console.log(`Hey, ${options.name}!`);
    });

program
    .command("activate <vaultName>")
    .description("switch active vault to specified vault name")
    .action((vaultName) => {
        console.log("Setting active vault to: ", vaultName);
    });

program
    .command("vault")
    .description("list currently active vault")
    .option("-a, --add <path>", "Add a vault to manage, at specified path")
    .option(
        "-n, --name <name>",
        "Specify name of vault to be added, overrides default option of end of path as name"
    )
    .option("-v, --verbose", "More verbose version of log")
    .action((options) => {
        if (!options.add) {
            for (let entry of vaults) {
                if (entry.activeVault) {
                    if (options.verbose) {
                        console.log(
                            "Currently active vault:",
                            entry.vaultName,
                            "at path",
                            entry.path
                        );
                    } else {
                        console.log("Currently active vault:", entry.vaultName);
                    }
                }
            }
        } else if (options.add) {
            let finalName = "";
            if (options.name) {
                finalName = options.name;
            } else {
                console.log("here?");
                finalName = options.add.split("/");
                if (finalName[finalName.length - 1] === "") {
                    finalName = finalName[finalName.length - 2];
                } else finalName = finalName[finalName.length - 1]; // Write some tests here
            }
            console.log(`Adding vault ${finalName} at path ${options.add}`);
            saveVault(options.add, finalName);
        }
    });

program
    .command("vaults")
    .description("list all available vaults")
    .action(() => {
        for (let name of vaultNames) {
            console.log(name);
        }
    });

//saveVault("testpath", "testname");

program.parse(process.argv);
