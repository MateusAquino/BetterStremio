/* BetterStremio:start */
function getBetterStremioPath() {
  const path = require("path");
  const pkg = require("./package")
  var appPath = process.env.APP_PATH
  if (!appPath) {
    var appPath = path.join(os.tmpdir(), pkg.name);
    if (process.platform === "linux")
      appPath = path.join(process.env.HOME, "."+pkg.name);
    else if (process.platform === "darwin")
      appPath = path.join(process.env.HOME, "Library", "Application Support", pkg.name);
    else if (process.platform === "win32")
      appPath = path.join(process.env.APPDATA, "stremio", pkg.name);
    else
      console.error("Unable to determine application path - export 'APP_PATH' instead")
  }
  if (process.platform === "linux" || process.platform === "darwin") return path.join(process.env.HOME, ".config", "BetterStremio");
  else return path.join(appPath, "BetterStremio");
 }

 enginefs.router.use("/better-stremio/src", (function (req, res, next) {
    const fs = require("fs");
    const path = require("path");
    const requestedPath = req.path.replace(/^\/better-stremio\/src/, "");
    const staticFolder = getBetterStremioPath();
    const filePath = path.join(staticFolder, requestedPath);

    res.setHeader("Access-Control-Allow-Origin", "*");

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {return next();}
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".wav": "audio/wav",
            ".mp4": "video/mp4",
            ".woff": "application/font-woff",
            ".ttf": "application/font-ttf",
            ".eot": "application/vnd.ms-fontobject",
            ".otf": "application/font-otf",
            ".wasm": "application/wasm",
        };

        const contentType = mimeTypes[ext] || "application/octet-stream";
        res.setHeader("Content-Type", contentType);

        // Stream the file to the response
        const readStream = fs.createReadStream(filePath);
        readStream.on("error", (streamErr) => {
            console.error("Error reading file:", streamErr);
            res.statusCode = 500;
            res.end("Internal Server Error");
        });
        readStream.pipe(res);
    });

})), enginefs.router.post("/better-stremio/update/:filename(*)", (async function(req, res, _next) {
    const fetch = require?.("node-fetch") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= exports \= fetch"))[0]);
    const fs = require?.("fs") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"fs\");"))[0]);
    let status = 500;
    let message = {};
    try {
        const from = req.query.from;
        const to = req.params.filename;
        if (!from || !to) {
            status = 400;
            throw new Error("Filename and query param 'from' is required.");
        }
        const response = await fetch(from);
        if (!response.ok) throw new Error('Failed to fetch the file.');
        const fileContents = await response.text();
        const filePath = path.resolve(getBetterStremioPath(), to);
        fs.writeFileSync(filePath, fileContents);
        status = 200;
        message = { message: 'File updated successfully.' };
    } catch (error) {
        message = { error: error.toString() };
    }
    message = JSON.stringify({filename: req.params, ...message});

    res.writeHead(status, {
        "content-type": "application/json",
        "content-length": message.length
    }), res.end(message);
})), enginefs.router.use("/better-stremio/folder", (function (_req, res, _next) {
    require?.("fs") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"fs\");"))[0]);
    const os = require?.("os") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"os\");"))[0]);
    const child_process = require?.("child_process") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"child_process\");"))[0]);

    try { 
        let BSPath = getBetterStremioPath();
        let cmd = ``;
        switch (os.platform().toLowerCase().replace(/[0-9]/g, ``).replace(`darwin`, `macos`)) {
            case `win`:
                BSPath = BSPath || '';
                cmd = `explorer`;
                break;
            case `linux`:
                BSPath = BSPath || '/';
                cmd = `xdg-open`;
                break;
            case `macos`:
                BSPath = BSPath || '/';
                cmd = `open`;
                break;
        }
        child_process.spawn(cmd, [BSPath]);
        res.writeHead(204);
        return res.end();
    } catch(err) {
        const message = JSON.stringify({error: err.toString()});
        res.writeHead(500, {
            "content-type": "application/json",
            "content-length": message.length
        }), res.end(message);
    }
})), enginefs.router.get("/better-stremio", (async function(_req, res, _next) {
    const fs = require?.("fs") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"fs\");"))[0]);
    let message;
    let status = 200;
    try {
        const BSPath = getBetterStremioPath();
        message = JSON.stringify({
            v: 1,
            path: BSPath,
            plugins: fs.readdirSync(path.resolve(BSPath, 'plugins')),
            themes: fs.readdirSync(path.resolve(BSPath, 'themes'))
        })
    } catch(error) {
        status = 501;
        message = JSON.stringify({error: error.toString()})
    };
    res.writeHead(status, {
        "content-type": "application/json",
        "content-length": message.length
    }), res.end(message);
})), enginefs.router.get("/", (async function(req, res, next) {
    if (!req.headers.host) return next("No host header");
    var socketConstructor = req.socket.constructor.name, protocol = "";

    if ("Socket" == socketConstructor) protocol = "http://"; else {
        if ("TLSSocket" != socketConstructor) return next("Unknown protocol");
        protocol = "https://";
    }
    
    res.write(`<base href="${webUILocation}"/>`)
    res.write(`<style type="text/css">@font-face {font-family: 'icon-full-height';src: url('${protocol + req.headers.host}/better-stremio/src/fonts/icon-full-height.ttf?3lc42w') format('truetype'), url('${protocol + req.headers.host}/better-stremio/src/fonts/icon-full-height.woff?3lc42w') format('woff');font-weight: normal;font-style: normal;} @font-face {font-family: 'PlusJakartaSans';src: url("${protocol + req.headers.host}/better-stremio/src/fonts/PlusJakartaSans.ttf") format('truetype')}</style>`)
    res.write(`<script type="text/javascript">BetterStremio = {host: "${protocol + req.headers.host}/better-stremio"}</script>`)
    res.write(`<script type="text/javascript" src="${protocol + req.headers.host}/better-stremio/src/BetterStremio.loader.js"></script>`)

    const fetch = require?.("node-fetch") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= exports \= fetch"))[0]);
    const shell = await fetch(webUILocation, {
      "headers": {
        "sec-ch-ua": "\"BetterStremio\";v=\"1\"",
        "sec-ch-ua-mobile": "?0",
        "upgrade-insecure-requests": "1"
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET"
    });
    res.end(await shell.text())
})), /* BetterStremio:end */
/* BetterStremio:start */
function getBetterStremioPath() {
  const path = require("path");
  const pkg = require("./package")
  var appPath = process.env.APP_PATH
  if (!appPath) {
    var appPath = path.join(os.tmpdir(), pkg.name);
    if (process.platform === "linux")
      appPath = path.join(process.env.HOME, "."+pkg.name);
    else if (process.platform === "darwin")
      appPath = path.join(process.env.HOME, "Library", "Application Support", pkg.name);
    else if (process.platform === "win32")
      appPath = path.join(process.env.APPDATA, "stremio", pkg.name);
    else
      console.error("Unable to determine application path - export 'APP_PATH' instead")
  }
  if (process.platform === "linux" || process.platform === "darwin") return path.join(process.env.HOME, ".config", "BetterStremio");
  else return path.join(appPath, "BetterStremio");
 }

 enginefs.router.use("/better-stremio/src", (function (req, res, next) {
    const fs = require("fs");
    const path = require("path");
    const requestedPath = req.path.replace(/^\/better-stremio\/src/, "");
    const staticFolder = getBetterStremioPath();
    const filePath = path.join(staticFolder, requestedPath);

    res.setHeader("Access-Control-Allow-Origin", "*");

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {return next();}
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".wav": "audio/wav",
            ".mp4": "video/mp4",
            ".woff": "application/font-woff",
            ".ttf": "application/font-ttf",
            ".eot": "application/vnd.ms-fontobject",
            ".otf": "application/font-otf",
            ".wasm": "application/wasm",
        };

        const contentType = mimeTypes[ext] || "application/octet-stream";
        res.setHeader("Content-Type", contentType);

        // Stream the file to the response
        const readStream = fs.createReadStream(filePath);
        readStream.on("error", (streamErr) => {
            console.error("Error reading file:", streamErr);
            res.statusCode = 500;
            res.end("Internal Server Error");
        });
        readStream.pipe(res);
    });

})), enginefs.router.post("/better-stremio/update/:filename(*)", (async function(req, res, _next) {
    const fetch = require?.("node-fetch") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= exports \= fetch"))[0]);
    const fs = require?.("fs") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"fs\");"))[0]);
    let status = 500;
    let message = {};
    try {
        const from = req.query.from;
        const to = req.params.filename;
        if (!from || !to) {
            status = 400;
            throw new Error("Filename and query param 'from' is required.");
        }
        const response = await fetch(from);
        if (!response.ok) throw new Error('Failed to fetch the file.');
        const fileContents = await response.text();
        const filePath = path.resolve(getBetterStremioPath(), to);
        fs.writeFileSync(filePath, fileContents);
        status = 200;
        message = { message: 'File updated successfully.' };
    } catch (error) {
        message = { error: error.toString() };
    }
    message = JSON.stringify({filename: req.params, ...message});

    res.writeHead(status, {
        "content-type": "application/json",
        "content-length": message.length
    }), res.end(message);
})), enginefs.router.use("/better-stremio/folder", (function (_req, res, _next) {
    require?.("fs") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"fs\");"))[0]);
    const os = require?.("os") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"os\");"))[0]);
    const child_process = require?.("child_process") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"child_process\");"))[0]);

    try { 
        let BSPath = getBetterStremioPath();
        let cmd = ``;
        switch (os.platform().toLowerCase().replace(/[0-9]/g, ``).replace(`darwin`, `macos`)) {
            case `win`:
                BSPath = BSPath || '';
                cmd = `explorer`;
                break;
            case `linux`:
                BSPath = BSPath || '/';
                cmd = `xdg-open`;
                break;
            case `macos`:
                BSPath = BSPath || '/';
                cmd = `open`;
                break;
        }
        child_process.spawn(cmd, [BSPath]);
        res.writeHead(204);
        return res.end();
    } catch(err) {
        const message = JSON.stringify({error: err.toString()});
        res.writeHead(500, {
            "content-type": "application/json",
            "content-length": message.length
        }), res.end(message);
    }
})), enginefs.router.get("/better-stremio", (async function(_req, res, _next) {
    const fs = require?.("fs") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= require(\"fs\");"))[0]);
    let message;
    let status = 200;
    try {
        const BSPath = getBetterStremioPath();
        message = JSON.stringify({
            v: 1,
            path: BSPath,
            plugins: fs.readdirSync(path.resolve(BSPath, 'plugins')),
            themes: fs.readdirSync(path.resolve(BSPath, 'themes'))
        })
    } catch(error) {
        status = 501;
        message = JSON.stringify({error: error.toString()})
    };
    res.writeHead(status, {
        "content-type": "application/json",
        "content-length": message.length
    }), res.end(message);
})), enginefs.router.get("/", (async function(req, res, next) {
    if (!req.headers.host) return next("No host header");
    var socketConstructor = req.socket.constructor.name, protocol = "";

    if ("Socket" == socketConstructor) protocol = "http://"; else {
        if ("TLSSocket" != socketConstructor) return next("Unknown protocol");
        protocol = "https://";
    }
    
    res.write(`<base href="${webUILocation}"/>`)
    res.write(`<style type="text/css">@font-face {font-family: 'icon-full-height';src: url('${protocol + req.headers.host}/better-stremio/src/fonts/icon-full-height.ttf?3lc42w') format('truetype'), url('${protocol + req.headers.host}/better-stremio/src/fonts/icon-full-height.woff?3lc42w') format('woff');font-weight: normal;font-style: normal;} @font-face {font-family: 'PlusJakartaSans';src: url("${protocol + req.headers.host}/better-stremio/src/fonts/PlusJakartaSans.ttf") format('truetype')}</style>`)
    res.write(`<script type="text/javascript">BetterStremio = {host: "${protocol + req.headers.host}/better-stremio"}</script>`)
    res.write(`<script type="text/javascript" src="${protocol + req.headers.host}/better-stremio/src/BetterStremio.loader.js"></script>`)

    const fetch = require?.("node-fetch") ?? __webpack_require__(Object.entries(__webpack_require__.m).find(([k, v]) => v.toString().includes("module.exports \= exports \= fetch"))[0]);
    const shell = await fetch(webUILocation, {
      "headers": {
        "sec-ch-ua": "\"BetterStremio\";v=\"1\"",
        "sec-ch-ua-mobile": "?0",
        "upgrade-insecure-requests": "1"
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET"
    });
    res.end(await shell.text())
})), /* BetterStremio:end */