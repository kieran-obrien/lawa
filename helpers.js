/*
 * * General helper functions for lawa
 */
const fs = require("fs");
const path = require("path");

const settingsJson = path.resolve(__dirname, "settings.json");

function loadPaths() {
    if (fs.existsSync(settingsJson)) {
        const settingsData = fs.readFileSync(settingsJson);
        return JSON.parse(settingsData).vaults;
    }
    return [];
}

function saveVault(path, vaultName, vaults) {
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

module.exports = { settingsJson, loadPaths, saveVault };
