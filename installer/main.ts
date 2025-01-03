/// <reference lib="deno.ns" />

import { WebUI } from "webui";
import path from "node:path";
import * as BetterStremio from "./src/lib/BetterStremio.ts";

if (Deno.build.os === "windows") {
  // hide terminal with powershell
  new Deno.Command("powershell", {
    args: [
      "-Command",
      'Add-Type -Name ConsoleUtils -Namespace Win32 -MemberDefinition \'[DllImport("Kernel32.dll")]public static extern IntPtr GetConsoleWindow();[DllImport("User32.dll")]public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);\';[Void][Win32.ConsoleUtils]::ShowWindow([Win32.ConsoleUtils]::GetConsoleWindow(), 0)',
    ],
  }).spawn();
}

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
const tempDirPath = Deno.realPathSync(Deno.makeTempDirSync());
const sizeX = 1202;
const sizeY = 743;

copyDirSync(path.join(import.meta.dirname!, "dist"), tempDirPath);
installer.setRootFolder(tempDirPath);
installer.setSize(sizeX, sizeY);

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
  event.window.run("setStatus('Stopping Stremio instance...')");
  BetterStremio.killStremio();

  BetterStremio.install(event, stremioPath, installWp, installAmoled).then(
    (result) => {
      event.window.run(
        "asyncResult({ result: " +
          JSON.stringify(result) +
          ", type: 'install' })",
      );
    },
  ).catch((e) => {
    console.error(e);
    event.window.run(
      "asyncResult({ result: 'Unknown error occurred while installing/repairing BetterStremio', type: 'install' })",
    );
  });
});

installer.bind("uninstall", (event) => {
  const stremioPath = event.arg.string(0);
  event.window.run("setStatus('Stopping Stremio instance...')");
  BetterStremio.killStremio();

  BetterStremio.uninstall(event, stremioPath).then((result) => {
    event.window.run(
      "asyncResult({ result: " +
        JSON.stringify(result) +
        ", type: 'uninstall' })",
    );
  }).catch((e) => {
    console.error(e);
    event.window.run(
      "asyncResult({ result: 'Unknown error occurred while uninstalling BetterStremio', type: 'uninstall' })",
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
