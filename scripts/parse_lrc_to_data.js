#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const USAGE = `
Usage:
  node scripts/parse_lrc_to_data.js --song-name <SongName> --lrc-file <path> --video-file <path> [options]

Options:
  --artist <name>      Artist name for Data.ts (default: "Suno AI")
  --title <title>      Explicit title (default: LRC filename without extension)
  --out-file <path>    Output file path (default: src/HelloWorld/<SongName>Data.ts)
`;

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = next;
    i++;
  }

  return args;
}

function escapeTsString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function toPosixPath(value) {
  return value.replace(/\\/g, "/");
}

function toLowerCamel(songName) {
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(songName)) {
    return songName.charAt(0).toLowerCase() + songName.slice(1);
  }

  const parts = songName
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error(
      `Cannot generate identifier from song name "${songName}". Use ASCII letters/numbers.`
    );
  }

  return (
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("")
  );
}

function extractStaticFilePath(videoFile) {
  const resolved = toPosixPath(path.resolve(videoFile));
  const marker = "/public/";
  const markerIndex = resolved.toLowerCase().lastIndexOf(marker);

  if (markerIndex >= 0) {
    return resolved.slice(markerIndex + marker.length);
  }

  const normalizedInput = toPosixPath(videoFile).replace(/^[./\\]+/, "");
  return normalizedInput.replace(/^public\//i, "");
}

function parseLrc(content) {
  const entries = [];
  const lines = content.split(/\r?\n/);
  const timeTagRegex = /\[(\d{2}:\d{2}(?:\.\d{2,3})?)\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeTagRegex)];
    if (matches.length === 0) {
      continue;
    }

    const text = line.replace(timeTagRegex, "").trim();
    if (!text) {
      continue;
    }

    for (const match of matches) {
      entries.push({
        timeTag: `[${match[1]}]`,
        text,
      });
    }
  }

  return entries;
}

function generateDataSource({
  dataVariableName,
  title,
  artist,
  staticVideoPath,
  lyrics,
}) {
  const lyricLines = lyrics
    .map(
      (line) =>
        `    { timeTag: "${escapeTsString(line.timeTag)}", text: "${escapeTsString(line.text)}" },`
    )
    .join("\n");

  return `/* eslint-disable no-irregular-whitespace */
import { staticFile } from "remotion";

export const ${dataVariableName} = {
  title: "${escapeTsString(title)}",
  artist: "${escapeTsString(artist)}",
  videoSource: staticFile("${escapeTsString(staticVideoPath)}"),
  fontSize: 42,
  bottomOffset: 100,
  lyrics: [
${lyricLines}
  ],
};
`;
}

function requireArg(value, name) {
  if (!value) {
    throw new Error(`Missing required argument: --${name}\n${USAGE}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const songName = args["song-name"];
  const lrcFile = args["lrc-file"];
  const videoFile = args["video-file"];
  const artist = args.artist || "Suno AI";

  requireArg(songName, "song-name");
  requireArg(lrcFile, "lrc-file");
  requireArg(videoFile, "video-file");

  const lrcAbsolute = path.resolve(lrcFile);
  const videoAbsolute = path.resolve(videoFile);

  if (!fs.existsSync(lrcAbsolute)) {
    throw new Error(`LRC file not found: ${lrcAbsolute}`);
  }
  if (!fs.existsSync(videoAbsolute)) {
    throw new Error(`Video file not found: ${videoAbsolute}`);
  }

  const lrcContent = fs.readFileSync(lrcAbsolute, "utf8");
  const lyrics = parseLrc(lrcContent);
  if (lyrics.length === 0) {
    throw new Error(`No timed lyrics found in: ${lrcAbsolute}`);
  }

  const title = args.title || path.basename(lrcAbsolute, path.extname(lrcAbsolute));
  const dataVariableName = `${toLowerCamel(songName)}Data`;
  const staticVideoPath = extractStaticFilePath(videoAbsolute);
  const outputPath = path.resolve(
    args["out-file"] || path.join("src", "HelloWorld", `${songName}Data.ts`)
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const source = generateDataSource({
    dataVariableName,
    title,
    artist,
    staticVideoPath,
    lyrics,
  });

  fs.writeFileSync(outputPath, source, "utf8");

  console.log(`Generated Data file: ${outputPath}`);
  console.log(`Lyrics parsed: ${lyrics.length}`);
  console.log(`Video source: ${staticVideoPath}`);
}

try {
  main();
} catch (error) {
  console.error(String(error && error.message ? error.message : error));
  process.exit(1);
}
