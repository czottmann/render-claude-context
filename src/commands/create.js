const { generateContextContent, getOutputPath, writeToFile, handleOriginMode } = require("../fileProcessor");

function createCommand(options) {
  try {

    if (options.outputFolder === "origin") {
      const filesCreated = handleOriginMode(options.filename);
      console.log(`Created ${filesCreated.length} context file(s):`);
      filesCreated.forEach((file) => console.log(`  ${file}`));
    } else {
      const content = generateContextContent();
      const outputPath = getOutputPath(
        options.outputFolder,
        options.filename,
      );
      writeToFile(content, outputPath);
      console.log(`Created 1 context file(s):`);
      console.log(`  ${outputPath}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = createCommand;