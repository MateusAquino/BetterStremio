#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi

/// <reference lib="deno.ns" />

import path from "node:path";

// Mock WebUI event for compatibility with existing functions
class MockWebUIEvent {
  window = {
    run: (script: string) => {
      // Extract status messages from the script
      const statusMatch = script.match(/setStatus\('([^']+)'\)/);
      if (statusMatch) {
        console.log(`[INFO] ${statusMatch[1]}`);
      }
    }
  };
}

const start = "/* BetterStremio:start */";
const end = "/* BetterStremio:end */";

const urlPatch =
  "https://raw.githubusercontent.com/MateusAquino/BetterStremio/refs/heads/main/patch.js";
const urlLoader =
  "https://raw.githubusercontent.com/MateusAquino/BetterStremio/refs/heads/main/BetterStremio.loader.js";
const urlFont1 =
  "https://raw.githubusercontent.com/MateusAquino/BetterStremio/refs/heads/main/fonts/icon-full-height.ttf";
const urlFont2 =
  "https://raw.githubusercontent.com/MateusAquino/BetterStremio/refs/heads/main/fonts/icon-full-height.woff";
const urlFont3 =
  "https://raw.githubusercontent.com/MateusAquino/BetterStremio/refs/heads/main/fonts/PlusJakartaSans.ttf";
const urlWp =
  "https://raw.githubusercontent.com/MateusAquino/WatchParty/refs/heads/main/WatchParty.plugin.js";
const urlAmoled =
  "https://raw.githubusercontent.com/REVENGE977/StremioAmoledTheme/refs/heads/main/amoled.theme.css";

const unixAlert = (src: string) =>
  Deno.build.os === "windows"
    ? ""
    : `\n\nFor Unix systems, run before patching:\n\nsudo chown username ${
      src.endsWith("/") ? src : src + "/"
    }*`;

async function download(url: string, filename: string) {
  console.log(`[DOWNLOAD] ${url} -> ${filename}`);
  const data = (await fetch(url)).arrayBuffer();
  return Deno.writeFile(filename, new Uint8Array(await data));
}

function getDefaultPath() {
  return Deno.build.os === "windows"
    ? `${Deno.env.get("LOCALAPPDATA")}\\Programs\\LNV\\Stremio-4\\`
    : "/opt/stremio/";
}

function getBetterStremioPath(stremioPath: string) {
  if (Deno.build.os === "windows") {
    return path.join(stremioPath, "BetterStremio");
  }
  return path.join(Deno.env.get("HOME")!, ".config", "BetterStremio");
}

async function installExtra(
  event: MockWebUIEvent,
  stremioPath: string,
  url: string,
  type: "plugins" | "themes",
  filename: string,
) {
  event.window.run(`setStatus('Downloading ${filename}...')`);
  const BetterStremioPath = getBetterStremioPath(stremioPath);
  try {
    await download(url, path.join(BetterStremioPath, type, filename));
    return true;
  } catch (e) {
    console.error(`[ERROR] Failed to download ${filename}:`, e);
    return false;
  }
}

async function patch(event: MockWebUIEvent, stremioPath: string) {
  console.log("[PATCH] Patching Stremio");
  event.window.run("setStatus('Patching Stremio...')");

  let patchContent;
  try {
    const data = (await fetch(urlPatch)).arrayBuffer();
    patchContent = new TextDecoder().decode(new Uint8Array(await data));
  } catch (e) {
    console.error("[ERROR] Failed to download patch:", e);
    return "Failed to download patch, make sure you have an established internet connection.";
  }

  const serverJs = path.join(stremioPath, "server.js");
  const contents = Deno.readTextFileSync(serverJs);

  try {
    const updatedContents = contents.replace(
      /enginefs\.router\.get/,
      `${patchContent.trim()}enginefs.router.get`,
    );
    Deno.writeTextFileSync(serverJs, updatedContents);
  } catch (e) {
    console.error("[ERROR] Failed to update server.js:", e);
    return (
      "Failed to update server.js, make sure BetterStremio is allowed to write to Stremio files." +
      unixAlert(stremioPath)
    );
  }
  return true;
}

function updateShortcuts(
  event: MockWebUIEvent,
  stremioPath: string,
  addArgs: string,
  removeArgs: string,
) {
  if (Deno.build.os === "windows") {
    event.window.run(
      "setStatus('Scanning for existing Stremio shortcuts (this may take a while)...')",
    );
    const desktop = new Deno.Command("powershell", {
      args: [
        "-c",
        "[Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)",
      ],
    });

    const desktopPath = new TextDecoder()
      .decode(desktop.outputSync().stdout)
      .trim();

    const desktopShortcuts = new Deno.Command("powershell", {
      args: [
        "-c",
        `Get-ChildItem -Recurse -Path "${desktopPath}" -Filter "*.lnk" | ForEach-Object {
      $file = $_.FullName
        if (Select-String -Path $file -Pattern "stremio.exe") {
          Write-Output $file
        }
      }`,
      ],
    });

    const desktopShortcutsResult = new TextDecoder().decode(
      desktopShortcuts.outputSync().stdout,
    );

    const ProgramDataShortcuts = new Deno.Command("powershell", {
      args: [
        "-c",
        `Get-ChildItem -Recurse -Path "$env:PROGRAMDATA\\Microsoft" -Filter "*.lnk" | ForEach-Object {
      $file = $_.FullName
        if (Select-String -Path $file -Pattern "stremio.exe") {
          Write-Output $file
        }
      }`,
      ],
    });
    const ProgramDataShortcutsResult = new TextDecoder().decode(
      ProgramDataShortcuts.outputSync().stdout,
    );

    const TaskBarShortcuts = new Deno.Command("powershell", {
      args: [
        "-c",
        `Get-ChildItem -Recurse -Path "$env:APPDATA\\Microsoft\\Internet Explorer\\Quick Launch\\User Pinned\\Taskbar" -Filter "*.lnk" | ForEach-Object {
      $file = $_.FullName
        if (Select-String -Path $file -Pattern "stremio.exe") {
          Write-Output $file
        }
      }`,
      ],
    });
    const TaskBarShortcutsResult = new TextDecoder().decode(
      TaskBarShortcuts.outputSync().stdout,
    );

    const AppDataShortcuts = new Deno.Command("powershell", {
      args: [
        "-c",
        `Get-ChildItem -Recurse -Path "$env:APPDATA\\Microsoft" -Filter "*.lnk" | ForEach-Object {
      $file = $_.FullName
        if (Select-String -Path $file -Pattern "stremio.exe") {
          Write-Output $file
        }
      }`,
      ],
    });
    const AppDataShortcutsResult = new TextDecoder().decode(
      AppDataShortcuts.outputSync().stdout,
    );

    const shortcuts = [
      desktopShortcutsResult,
      ProgramDataShortcutsResult,
      AppDataShortcutsResult,
      TaskBarShortcutsResult,
    ]
      .join("")
      .trim()
      .split("\n");

    event.window.run(
      "setStatus('Found " + shortcuts.length +
        " shortcuts, updating cmd args (this may take a while)...')",
    );
    console.log("[SHORTCUTS] Found shortcuts:", shortcuts);
    for (const shortcut of shortcuts) {
      console.log("[SHORTCUTS] Updating shortcut:", shortcut);
      const shortcutPath = shortcut.trim();
      if (shortcutPath === "") continue;
      const cmd = new Deno.Command("powershell", {
        args: [
          "-c",
          `[void][Reflection.Assembly]::LoadWithPartialName('IWshRuntimeLibrary');$shell = New-Object -ComObject WScript.Shell;$shortcut = $shell.CreateShortcut('${shortcutPath}');$shortcut.Arguments = $shortcut.Arguments -replace '${removeArgs}', '';if ($shortcut.Arguments -notmatch '${addArgs}') {$shortcut.Arguments += '${addArgs}'};$shortcut.Save()`,
        ],
      });
      cmd.outputSync();
    }
  } else {
    // For macOS and Linux, we need to handle shortcuts differently
    if (Deno.build.os === "darwin") {
      // macOS doesn't use .desktop files, shortcuts are handled by the system
      event.window.run("setStatus('macOS detected - shortcuts will need to be updated manually')");
      console.log("[INFO] On macOS, you'll need to manually update Stremio shortcuts to include: --development --streaming-server");
    } else {
      // Linux desktop shortcut handling
      event.window.run(
        "setStatus('Updating smartcode-stremio.desktop shortcut...')",
      );
      const desktopApp = path.join(stremioPath, "smartcode-stremio.desktop");
      try {
        const desktopAppContents = Deno.readTextFileSync(desktopApp);
        const rgx = /Exec=(?!.*--development --streaming-server.*).*/;
        const updatedDesktopAppContents = desktopAppContents
          .replace(removeArgs, "")
          .replace(rgx, `$&${addArgs}`);
        Deno.writeTextFileSync(desktopApp, updatedDesktopAppContents);
      } catch (e) {
        console.log("[INFO] No desktop shortcut found, skipping shortcut update");
      }
    }
  }
}

async function install(
  event: MockWebUIEvent,
  stremioPath: string,
  installWp: boolean,
  installAmoled: boolean,
) {
  event.window.run("setStatus('Creating BetterStremio folder...')");
  const BetterStremioPath = getBetterStremioPath(stremioPath);

  try {
    Deno.mkdirSync(BetterStremioPath, { recursive: true });
  } catch (e) {
    console.error("[ERROR] Failed to create BetterStremio folder:", e);
    return "Failed to create BetterStremio folder, make sure BetterStremio is allowed to write to Stremio files.";
  }

  Deno.mkdirSync(path.join(BetterStremioPath, "themes"), { recursive: true });
  Deno.mkdirSync(path.join(BetterStremioPath, "fonts"), { recursive: true });
  Deno.mkdirSync(path.join(BetterStremioPath, "plugins"), { recursive: true });

  try {
    event.window.run("setStatus('Downloading BetterStremio loader...')");
    await download(
      urlLoader,
      path.join(BetterStremioPath, "BetterStremio.loader.js"),
    );
    event.window.run(
      "setStatus('Downloading missing Stremio fonts (icon-full-height.ttf)...')",
    );
    await download(
      urlFont1,
      path.join(BetterStremioPath, "fonts", "icon-full-height.ttf"),
    );
    event.window.run(
      "setStatus('Downloading missing Stremio fonts (icon-full-height.woff)...')",
    );
    await download(
      urlFont2,
      path.join(BetterStremioPath, "fonts", "icon-full-height.woff"),
    );
    event.window.run(
      "setStatus('Downloading missing Stremio fonts (PlusJakartaSans.ttf)...')",
    );
    await download(
      urlFont3,
      path.join(BetterStremioPath, "fonts", "PlusJakartaSans.ttf"),
    );
  } catch (e) {
    console.error("[ERROR] Failed to download BetterStremio files:", e);
    return "Failed to download BetterStremio files, make sure you have an established internet connection.";
  }

  event.window.run("setStatus('Removing previous BetterStremio patches...')");
  const uninstallResult = await uninstall(event, stremioPath, false);
  if (uninstallResult !== true) return uninstallResult;
  const patchResult = await patch(event, stremioPath);
  if (patchResult !== true) return patchResult;

  try {
    updateShortcuts(
      event,
      stremioPath,
      " --development --streaming-server",
      "",
    );
  } catch (e) {
    console.error("[ERROR] Failed to update shortcuts:", e);
    return (
      "Failed to update existing Stremio shortcuts args: " +
      (e as Error).toString() +
      unixAlert(stremioPath)
    );
  }

  const resultWp = installWp
    ? await installExtra(event, stremioPath, urlWp, "plugins", "WatchParty.plugin.js")
    : true;
  const resultAmoled = installAmoled
    ? await installExtra(event, stremioPath, urlAmoled, "themes", "amoled.theme.css")
    : true;

  return resultWp && resultAmoled
    ? true
    : "BetterStremio was successfully installed, but these extras failed: " +
      (resultWp ? "" : "WatchParty") +
      (!resultWp && !resultAmoled ? ", " : "") +
      (resultAmoled ? "" : "Amoled theme");
}

// deno-lint-ignore require-await
async function uninstall(
  event: MockWebUIEvent,
  stremioPath: string,
  shouldUpdateShortcuts = true,
) {
  const serverJs = path.join(stremioPath, "server.js");
  let contents;
  try {
    contents = Deno.readTextFileSync(serverJs);
  } catch (e) {
    console.error("[ERROR] Failed to read server.js:", e);
    return (
      "Failed to read server.js, make sure BetterStremio is allowed to access Stremio files." +
      unixAlert(stremioPath)
    );
  }
  if (!contents.includes(start)) return true;
  event.window.run("setStatus('Unpatching Stremio...')");
  const startIdx = contents.indexOf(start);
  const endIdx = contents.indexOf(end, startIdx);
  if (startIdx === -1 || endIdx === -1) {
    return "Failed to uninstall BetterStremio, is your Stremio installation corrupted?";
  }
  const newContents = contents.slice(0, startIdx) +
    contents.slice(endIdx + end.length);
  try {
    Deno.writeTextFileSync(serverJs, newContents);
  } catch (e) {
    console.error("[ERROR] Failed to update server.js:", e);

    return (
      "Failed to update server.js, make sure BetterStremio is allowed to write to Stremio files." +
      unixAlert(stremioPath)
    );
  }

  try {
    if (shouldUpdateShortcuts) {
      updateShortcuts(
        event,
        stremioPath,
        "",
        " --development --streaming-server",
      );
    }
  } catch (e) {
    console.error("[ERROR] Failed to update shortcuts:", e);
    return (
      "Failed to update existing Stremio shortcuts args: " +
      (e as Error).toString() +
      unixAlert(stremioPath)
    );
  }

  return true;
}

function killStremio() {
  console.log("[KILL] Stopping Stremio instance...");
  if (Deno.build.os === "windows") {
    const cmd = new Deno.Command("taskkill", {
      args: ["/F", "/IM", "stremio.exe"],
    });
    return cmd.outputSync();
  } else {
    const cmd = new Deno.Command("pkill", { args: ["-f", "stremio"] });
    return cmd.outputSync();
  }
}

function validatePath(stremioPath: string): boolean {
  try {
    const fileInfo = Deno.lstatSync(stremioPath);
    if (!fileInfo.isDirectory) return false;
    const files = Deno.readDirSync(stremioPath);
    for (const file of files) {
      if (file.isFile && file.name === "server.js") {
        return true;
      }
    }
  } catch (_e) {
    // ignore error
  }
  return false;
}

function showHelp() {
  console.log(`
BetterStremio CLI Installer

Usage:
  deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts [command] [options]

Commands:
  install [path]     Install BetterStremio to the specified Stremio path
  uninstall [path]   Uninstall BetterStremio from the specified Stremio path
  help              Show this help message

Options:
  --watchparty      Also install WatchParty plugin
  --amoled          Also install Amoled theme
  --default-path    Use the default Stremio installation path

Examples:
  # Install with default path and extras
  deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install --default-path --watchparty --amoled
  
  # Install to custom path
  deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install "/opt/stremio"
  
  # Uninstall from default path
  deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts uninstall --default-path

Default Stremio paths:
  Windows: ${Deno.env.get("LOCALAPPDATA")}\\Programs\\LNV\\Stremio-4\\
  Linux/macOS: /opt/stremio/
`);
}

async function main() {
  const args = Deno.args;
  
  if (args.length === 0 || args.includes("help") || args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  const command = args[0];
  const event = new MockWebUIEvent();

  if (command === "install") {
    let stremioPath = "";
    let installWp = false;
    let installAmoled = false;

    // Parse arguments
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "--watchparty") {
        installWp = true;
      } else if (arg === "--amoled") {
        installAmoled = true;
      } else if (arg === "--default-path") {
        stremioPath = getDefaultPath();
      } else if (!arg.startsWith("--")) {
        stremioPath = arg;
      }
    }

    // Use default path if not specified
    if (!stremioPath) {
      stremioPath = getDefaultPath();
    }

    console.log(`[INSTALL] Installing BetterStremio to: ${stremioPath}`);
    console.log(`[OPTIONS] WatchParty: ${installWp}, Amoled: ${installAmoled}`);

    if (!validatePath(stremioPath)) {
      console.error(`[ERROR] Invalid Stremio path: ${stremioPath}`);
      console.error("Make sure the path contains a server.js file");
      Deno.exit(1);
    }

    killStremio();
    const result = await install(event, stremioPath, installWp, installAmoled);
    
    if (result === true) {
      console.log("[SUCCESS] BetterStremio installed successfully!");
    } else {
      console.error("[ERROR]", result);
      Deno.exit(1);
    }

  } else if (command === "uninstall") {
    let stremioPath = "";

    // Parse arguments
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "--default-path") {
        stremioPath = getDefaultPath();
      } else if (!arg.startsWith("--")) {
        stremioPath = arg;
      }
    }

    // Use default path if not specified
    if (!stremioPath) {
      stremioPath = getDefaultPath();
    }

    console.log(`[UNINSTALL] Uninstalling BetterStremio from: ${stremioPath}`);

    if (!validatePath(stremioPath)) {
      console.error(`[ERROR] Invalid Stremio path: ${stremioPath}`);
      console.error("Make sure the path contains a server.js file");
      Deno.exit(1);
    }

    killStremio();
    const result = await uninstall(event, stremioPath);
    
    if (result === true) {
      console.log("[SUCCESS] BetterStremio uninstalled successfully!");
    } else {
      console.error("[ERROR]", result);
      Deno.exit(1);
    }

  } else {
    console.error(`[ERROR] Unknown command: ${command}`);
    showHelp();
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main().catch((error) => {
    console.error("[FATAL ERROR]", error);
    Deno.exit(1);
  });
}
