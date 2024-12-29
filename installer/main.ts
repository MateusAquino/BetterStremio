/// <reference lib="deno.ns" />

import { WebUI } from "webui";
import path from "node:path";
import si from "systeminformation";
import * as BetterStremio from "./src/lib/BetterStremio.ts";

function copyDirSync(src: string, dest: string) {
  const files = Deno.readDirSync(src);
  for (const file of files) {
    if (file.isFile) {
      Deno.copyFileSync(path.join(src, file.name), path.join(dest, file.name));
    } else if (file.isDirectory) {
      Deno.mkdirSync(path.join(dest, file.name));
      copyDirSync(path.join(src, file.name), path.join(dest, file.name));
    }
  }
}

const installer = new WebUI();
const tempDirPath = Deno.makeTempDirSync();
const sizeX = 1202;
const sizeY = 743;

copyDirSync(path.join(import.meta.dirname!, "dist"), tempDirPath);
installer.setRootFolder(tempDirPath);
installer.setSize(sizeX, sizeY);

try {
  const { displays } = await si.graphics();
  if (!displays.length) throw new Error("No displays");

  const width = displays[0].currentResX!;
  const height = displays[0].currentResY!;
  installer.setPosition(
    Math.round(width / 2 - sizeX / 2),
    Math.round(height / 2 - sizeY / 2)
  );
} catch (_e) {
  // Fallback to default position
}

installer.bind("getPath", () => BetterStremio.getDefaultPath());

installer.bind("validatePath", (event) => {
  const path = event.arg.string(0);
  try {
    const fileInfo = Deno.lstatSync(path);
    if (!fileInfo.isDirectory) return false;
    const files = Deno.readDirSync(path);
    for (const file of files) {
      if (file.isFile && file.name === "server.js") {
        return true;
      }
    }
  } catch (_e) {
    // ignore error
  }
  return false;
});

installer.bind("install", (event) => {
  const stremioPath = event.arg.string(0);
  const installWp = event.arg.boolean(1);
  const installAmoled = event.arg.boolean(2);
  BetterStremio.killStremio();

  BetterStremio.install(stremioPath, installWp, installAmoled).then(
    (result) => {
      event.window.run(
        "asyncResult({ result: " +
          JSON.stringify(result) +
          ", type: 'install' })"
      );
    }
  );
});

installer.bind("uninstall", (event) => {
  const stremioPath = event.arg.string(0);
  BetterStremio.killStremio();

  BetterStremio.uninstall(stremioPath).then((result) => {
    event.window.run(
      "asyncResult({ result: " +
        JSON.stringify(result) +
        ", type: 'uninstall' })"
    );
  });
});

installer.show("index.html");

try {
  Deno.removeSync("./x", { recursive: true });
} catch (_e) {
  // webui lib was not created on cwd
}

await WebUI.wait();

try {
  Deno.removeSync(tempDirPath, { recursive: true });
} catch (_e) {
  // temp dir was removed externally
}

Deno.exit(0);
