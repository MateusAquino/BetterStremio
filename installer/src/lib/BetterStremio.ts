/// <reference lib="deno.ns" />

import path from "node:path";

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
    : ` For Unix systems, run before patching:\n\nsudo chown username ${src}`;

async function download(url: string, filename: string) {
  console.log("Downloading", url, "to", filename);
  const data = (await fetch(url)).arrayBuffer();
  return Deno.writeFile(filename, new Uint8Array(await data));
}

export function getDefaultPath() {
  if (Deno.build.os === "windows")
    return "%localAppData%\\Programs\\LNV\\Stremio-4\\";
  return "/opt/stremio/";
}

export function getBetterStremioPath(stremioPath: string) {
  if (Deno.build.os === "windows")
    return path.join(stremioPath, "BetterStremio");
  return path.join(Deno.env.get("HOME")!, ".config", "BetterStremio");
}

export async function installExtra(
  stremioPath: string,
  url: string,
  type: "plugins" | "themes",
  filename: string
) {
  const BetterStremioPath = getBetterStremioPath(stremioPath);
  try {
    await download(url, path.join(BetterStremioPath, type, filename));
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function patch(stremioPath: string) {
  console.log("Patching Stremio");

  let patchContent;
  try {
    const data = (await fetch(urlPatch)).arrayBuffer();
    patchContent = new TextDecoder().decode(new Uint8Array(await data));
  } catch (e) {
    console.error(e);
    return "Failed to download patch, make sure you have an established internet connection.";
  }

  const serverJs = path.join(stremioPath, "server.js");
  const contents = Deno.readTextFileSync(serverJs);

  try {
    const updatedContents = contents.replace(
      /enginefs\.router\.get/,
      `${patchContent.trim()}enginefs.router.get`
    );
    Deno.writeTextFileSync(serverJs, updatedContents);
  } catch (e) {
    console.error(e);
    return (
      "Failed to update server.js, make sure BetterStremio is allowed to write to Stremio files." +
      unixAlert(serverJs)
    );
  }
  return true;
}

async function modifyRegistry(
  _addArgs: string[] = [],
  _removeArgs: string[] = []
) {
  return await true;
  // const registryPath = `"HKCR\\Stremio\\shell\\open\\command"`;

  // // Read the current value
  // const readProcess = new Deno.Command("reg", {
  //   args: ["query", registryPath, "/ve"],
  // });

  // const result = await readProcess.outputSync();
  // if (!success) {
  //   console.error(new TextDecoder().decode(error));
  //   throw new Error("Failed to read registry value.");
  // }

  // const registryOutput = new TextDecoder().decode(await readProcess.output());
  // const match = registryOutput.match(/"(.+?)"/); // Extract the current command
  // if (!match) {
  //   throw new Error("Failed to parse registry value.");
  // }

  // let command = match[1]; // Current command value

  // // Remove specified arguments
  // removeArgs.forEach((arg) => {
  //   const regex = new RegExp(`\\s*${arg}`, "g");
  //   command = command.replace(regex, "");
  // });

  // // Add specified arguments (if not already present)
  // addArgs.forEach((arg) => {
  //   if (!command.includes(arg)) {
  //     command += ` ${arg}`;
  //   }
  // });

  // // Update the registry
  // const updateProcess = Deno.run({
  //   cmd: ["reg", "add", registryPath, "/ve", "/d", `"${command}"`, "/f"],
  //   stdout: "inherit",
  //   stderr: "inherit",
  // });

  // const updateStatus = await updateProcess.status();
  // if (!updateStatus.success) {
  //   throw new Error("Failed to update registry value.");
  // }

  // console.log("Registry updated successfully:", command);
}

export async function install(
  stremioPath: string,
  installWp: boolean,
  installAmoled: boolean
) {
  const BetterStremioPath = getBetterStremioPath(stremioPath);

  try {
    Deno.mkdirSync(BetterStremioPath, { recursive: true });
  } catch (e) {
    console.error(e);
    return "Failed to create BetterStremio folder, make sure BetterStremio is allowed to write to Stremio files.";
  }

  Deno.mkdirSync(path.join(BetterStremioPath, "themes"), { recursive: true });
  Deno.mkdirSync(path.join(BetterStremioPath, "fonts"), { recursive: true });
  Deno.mkdirSync(path.join(BetterStremioPath, "plugins"), { recursive: true });

  try {
    console.log("TODO: UNCOMMENT THIS");
    // await download(
    //   urlLoader,
    //   path.join(BetterStremioPath, "BetterStremio.loader.js")
    // );
    // await download(
    //   urlFont1,
    //   path.join(BetterStremioPath, "fonts", "icon-full-height.ttf")
    // );
    // await download(
    //   urlFont2,
    //   path.join(BetterStremioPath, "fonts", "icon-full-height.woff")
    // );
    // await download(
    //   urlFont3,
    //   path.join(BetterStremioPath, "fonts", "PlusJakartaSans.ttf")
    // );
  } catch (e) {
    console.error(e);
    return "Failed to download BetterStremio files, make sure you have an established internet connection.";
  }

  const uninstallResult = await uninstall(stremioPath);
  if (uninstallResult !== true) return uninstallResult;
  const patchResult = await patch(stremioPath);
  if (patchResult !== true) return patchResult;

  try {
    await modifyRegistry(["--development", "--streaming-server"], []);
  } catch (e) {
    console.error(e);
    return "Failed to update registry, make sure BetterStremio is allowed to modify the registry.";
  }

  const resultWp = installWp
    ? installExtra(stremioPath, urlWp, "plugins", "WatchParty.plugin.js")
    : true;
  const resultAmoled = installAmoled
    ? installExtra(stremioPath, urlAmoled, "themes", "amoled.theme.css")
    : true;

  return resultWp && resultAmoled
    ? true
    : "BetterStremio was successfully installed, but these extras failed: " +
        (resultWp ? "" : "WatchParty") +
        (!resultWp && !resultAmoled ? ", " : "") +
        (resultAmoled ? "" : "Amoled theme");
}

export async function uninstall(stremioPath: string) {
  const serverJs = path.join(stremioPath, "server.js");
  let contents;
  try {
    contents = Deno.readTextFileSync(serverJs);
  } catch (e) {
    console.error(e);
    return (
      "Failed to read server.js, make sure BetterStremio is allowed to access Stremio files." +
      unixAlert(serverJs)
    );
  }
  if (!contents.includes(start)) return true;
  const startIdx = contents.indexOf(start);
  const endIdx = contents.indexOf(end, startIdx);
  if (startIdx === -1 || endIdx === -1)
    return "Failed to uninstall BetterStremio, is your Stremio installation corrupted?";
  const newContents =
    contents.slice(0, startIdx) + contents.slice(endIdx + end.length);
  try {
    Deno.writeTextFileSync(serverJs, newContents);
  } catch (e) {
    console.error(e);

    return (
      "Failed to update server.js, make sure BetterStremio is allowed to write to Stremio files." +
      unixAlert(serverJs)
    );
  }

  try {
    await modifyRegistry([], ["--development", "--streaming-server"]);
  } catch (e) {
    console.error(e);
    return "Failed to update registry, make sure BetterStremio is allowed to modify the registry.";
  }
  return true;
}

export function killStremio() {
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
