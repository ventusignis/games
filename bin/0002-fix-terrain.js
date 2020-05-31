#!/usr/bin/env node

// This file converts old style "mountain" and "water" terrain to new style "terrain" objects.

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const { is, map } = require("ramda");
const pkg = require("../package.json");

// Global program options
program.version(pkg.version, "-v, --version", "output the current version");

const addTerrain = (hex, type, data) => {
  const output = { ...hex };

  if (!output.terrain) {
    output.terrain = [];
  }

  output.terrain.push({
    ...data,
    type,
  });

  return output;
};

const convertHex = (hex) => {
  let output = { ...hex };
  if (hex.mountain) {
    output = addTerrain(output, "mountain", hex.mountain);
    delete output.mountain;
  }
  if (hex.water) {
    output = addTerrain(output, "water", hex.water);
    delete output.water;
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
