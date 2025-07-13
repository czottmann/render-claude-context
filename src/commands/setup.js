const fs = require("fs");
const path = require("path");
const os = require("os");

function setupCommand(options) {
  try {
    if (options.filename === "CLAUDE.md") {
      console.error(
        "Error: Cannot use 'CLAUDE.md' as output filename to prevent overwriting source files",
      );
      process.exit(1);
    }

    if (options.outputFolder === "origin") {
      console.log("Setup command not applicable for origin mode");
      return;
    }

    const settingsPath = path.join(
      os.homedir(),
      ".gemini",
      "settings.json",
    );

    let settings = {};
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }

    if (!settings.contextFileName) {
      settings.contextFileName = [];
    }

    // Always add the specified filename to settings
    if (!settings.contextFileName.includes(options.filename)) {
      settings.contextFileName.push(options.filename);

      const settingsDir = path.dirname(settingsPath);
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
      }

      fs.writeFileSync(
        settingsPath,
        JSON.stringify(settings, null, 2),
        "utf8",
      );
      console.log(
        `Added ${options.filename} to ~/.gemini/settings.json contextFileName array`,
      );
    } else {
      console.log(
        `${options.filename} already exists in ~/.gemini/settings.json contextFileName array`,
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = setupCommand;