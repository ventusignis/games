#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const pkg = require("../package.json");

// Global program options
program.version(pkg.version, "-v, --version", "output the current version");

const processFiles = (files) => {
  files.forEach((file) => {
    const filename = path.join(process.cwd(), file);
    const json = require(filename);

    if (json.phases) {
      json.phases = json.phases.map((phase) => {
        if (phase.phase) {
          phase.name = phase.phase;
          delete phase.phase;
        }
        if (parseInt(phase.limit)) {
          phase.limit = parseInt(phase.limit);
        }
        delete phase.number;
        delete phase.price;
        delete phase.rust;
        delete phase.rusts;
        return phase;
      });
    }

    fs.writeFileSync(filename, JSON.stringify(json, null, 2));
  });
};

// Pass in a list of files to validate
program.arguments("<files...>").action((files) => {
  return processFiles(files);
});

program.parse();
