/**
 * @fileoverview Setup command implementation for AI tool integration.
 * Adds filename to target AI tool settings for auto-loading context files.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { getTargetConfig } = require("../utils/targets");
const { getNestedProperty, setNestedProperty, hasNestedProperty } = require("../utils/nestedProperties");

/**
 * Adds filename to target AI tool settings array for automatic context loading.
 * Handles both string and array context settings formats, ensuring array output.
 * 
 * @param {Object} options - Command options from Commander.js
 * @param {string} options.filename - Filename to add to target settings
 * @param {string} options.target - Target AI tool name
 */
function setupCommand(options) {
  try {
    const targetConfig = getTargetConfig(options.target);
    const { settingsPath, contextKey, name } = targetConfig;

    let settings = {};
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }

    // Ensure context key is always an array
    let contextArray = getNestedProperty(settings, contextKey);
    if (!contextArray) {
      contextArray = [];
    } else if (typeof contextArray === "string") {
      contextArray = [contextArray];
    }

    // Always add the specified filename to settings
    if (!contextArray.includes(options.filename)) {
      contextArray.push(options.filename);
      setNestedProperty(settings, contextKey, contextArray);

      const settingsDir = path.dirname(settingsPath);
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
      }

      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
      console.log(
        `Added ${options.filename} to ${name} ${contextKey} array at ${settingsPath}`,
      );
    } else {
      console.log(
        `${options.filename} already exists in ${name} ${contextKey} array at ${settingsPath}`,
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = setupCommand;
