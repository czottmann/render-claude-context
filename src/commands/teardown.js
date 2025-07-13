const fs = require("fs");
const path = require("path");
const os = require("os");

function teardownCommand(options) {
  try {
    if (options.filename === "CLAUDE.md") {
      console.error(
        "Error: Cannot use 'CLAUDE.md' as output filename to prevent overwriting source files",
      );
      process.exit(1);
    }

    if (options.outputFolder === "origin") {
      console.log("Teardown command not applicable for origin mode");
      return;
    }

    const settingsPath = path.join(
      os.homedir(),
      ".gemini",
      "settings.json",
    );

    if (!fs.existsSync(settingsPath)) {
      console.log("No Gemini settings file found");
      return;
    }

    let settings = {};
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch (error) {
      console.error("Error reading Gemini settings file:", error.message);
      process.exit(1);
    }

    if (
      !settings.contextFileName ||
      !Array.isArray(settings.contextFileName)
    ) {
      console.log("No contextFileName array found in Gemini settings");
      return;
    }

    const index = settings.contextFileName.indexOf(options.filename);
    if (index !== -1) {
      settings.contextFileName.splice(index, 1);

      fs.writeFileSync(
        settingsPath,
        JSON.stringify(settings, null, 2),
        "utf8",
      );
      console.log(
        `Removed ${options.filename} from ~/.gemini/settings.json contextFileName array`,
      );
    } else {
      console.log(
        `${options.filename} not found in ~/.gemini/settings.json contextFileName array`,
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = teardownCommand;