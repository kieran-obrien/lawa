#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

const settingsJson = helpers.settingsJson; // Load vaults config

const vaults = helpers.loadPaths(); // Vaults array of obj
const vaultNames = vaults.map((vault) => vault.vaultName); // Vaults array of str names

const saveVault = helpers.saveVault;
const writeToSettingsJSON = helpers.writeToSettingsJSON;

program
    .version("1.0.0")
    .description("An Obsidian CLI helper tool.")
    .action(() => {
        console.log("You're using lawa, an Obsidian helper tool.");
        console.log("Use lawa --help for more info on usage.");
    });

program
    .command("activate <vaultName>")
    .description("switch active vault to specified vault name")
    .action((vaultName) => {
        let isVaultExist = false;
        for (let entry of vaults) {
            if (entry.activeVault) {
                entry.activeVault = false;
            }
            if (entry.vaultName === vaultName) {
                isVaultExist = true;
                entry.activeVault = true;
            }
        }
        if (!isVaultExist)
            return console.log(
                "Vault not found, use lawa vault --help for details"
            ); // Vault not on file
        console.log("Active vault set to:", vaultName);
        writeToSettingsJSON(settingsJson, vaults);
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
                        return;
                    } else {
                        console.log("Currently active vault:", entry.vaultName);
                        return;
                    }
                }
            }
            console.log(
                "No currently active vault, use lawa activate <vaultName>"
            );
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
            console.log(`Adding vault ${finalName} with path ${options.add}`);
            saveVault(options.add, finalName, vaults);
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

program.parse();
