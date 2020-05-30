#!/usr/bin/env node

// This file converts old style "offBoardTrack" to new "offboard" track.

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const { is, map, forEach } = require("ramda");
const pkg = require("../package.json");

// Global program options
program.version(pkg.version, "-v, --version", "output the current version");

const addOffboardTrack = (hex, data) => {
  const output = { ...hex };

  if (!output.track) {
    output.track = [];
  }

  output.track.push({
    ...data,
    type: "offboard",
  });

  return output;
};

const convertHex = (hex) => {
  let output = { ...hex };
  if (hex.offBoardTrack) {
    forEach((track) => {
      output = addOffboardTrack(output, track);
    }, hex.offBoardTrack);
    delete output.offBoardTrack;
  }
  return output;
};

const convertMap = (m) => {
  let output = { ...m };
  output.hexes = map(convertHex, m.hexes || []);
  return output;
};

const processFiles = (files) => {
  files.forEach((file) => {
    const filename = path.join(process.cwd(), file);
    const json = require(filename);

    if (is(Array, json.map)) {
      json.map = map(convertMap, json.map);
    } else if (json.map) {
      json.map = convertMap(json.map);
    }

    fs.writeFileSync(filename, JSON.stringify(json, null, 2));
  });
};

// Pass in a list of files to validate
program.arguments("<files...>").action((files) => {
  return processFiles(files);
});

program.parse();
