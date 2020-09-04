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

const fixTrack = (track) => {
  switch (track.type) {
    case "sharpStopRev":
      return {
        ...track,
        type: "sharp",
        start: 0.5,
        side: ((track.side + 4) % 6) + 1,
      };
    case "sharpStop":
      return { ...track, type: "sharp", end: 0.5 };
    case "gentleStopRev":
      return {
        ...track,
        type: "gentle",
        start: 0.25,
        side: ((track.side + 3) % 6) + 1,
      };
    case "gentleStop":
      return { ...track, type: "gentle", end: 0.75 };
    case "straightStop":
      return { ...track, type: "straight", end: 0.75 };
    case "stub":
      return { ...track, type: "straight", end: 0.125 };
    case "mid":
      return { ...track, type: "straight", end: 0.5, start: 0.25 };
    case "stop":
      return { ...track, type: "straight", end: 0.25 };
    default:
      return track;
  }
};

const convertHex = (hex) => {
  let output = { ...hex };

  if (hex.track) {
    output.track = map(fixTrack, hex.track);
  }

  return output;
};

const convertTile = (tile) => {
  if (is(Object, tile)) {
    if (tile.track) {
      tile.track = map(fixTrack, tile.track);
      return tile;
    } else {
      return tile;
    }
  } else {
    return tile;
  }
};

const convertMap = (m) => {
  let output = { ...m };
  output.hexes = map(convertHex, m.hexes || []);
  return output;
};

const processFiles = (files) => {
  files.forEach((file) => {
    const filename = path.join(process.cwd(), file);
    let json = require(filename);

    if (json.info) {
      // Game File
      if (is(Array, json.map)) {
        json.map = map(convertMap, json.map);
      } else if (json.map) {
        json.map = convertMap(json.map);
      }

      if (json.tiles) {
        json.tiles = map(convertTile, json.tiles);
      }
    } else {
      // Tile File
      json = map(convertTile, json);
    }

    fs.writeFileSync(filename, JSON.stringify(json, null, 2));
  });
};

// Pass in a list of files to validate
program.arguments("<files...>").action((files) => {
  return processFiles(files);
});

program.parse();
