<h1 align="center">
    <img width="200" src="./logo.png" align="center"></img>
</h1>


<p align="center">🎬 <strong>BetterStremio</strong> is a dynamic Plugin & Theme loader for Stremio.</p>

## 💡 How it works

**BetterStremio** patches the `server.js` file to inject code in the local development web server hosted at `127.0.0.1:11470` and adds a loader script to run external plugins and CSS themes. There is no need to download external custom Stremio executables! :)


![image](https://github.com/MateusAquino/BetterStremio/assets/16140783/1d721c4f-6493-4ed7-bb6c-ddc804b88630)

## 🚀 Getting Started

<p align="left">
  <a target="_blank" href="https://github.com/MateusAquino/BetterStremio">
    <img width="450px" alt="Installer" title="Installer" align="right" src="https://github.com/user-attachments/assets/ff9248ca-2b17-439b-88a2-d28f1c2d9972"></img>
  </a>
</p>

## 📦 Installation Methods

### Method 1: GUI Installer (Recommended for most users)

Download and run the installer from the [releases page](https://github.com/MateusAquino/BetterStremio/releases/). You can also choose the "Uninstall" option to unpatch changes made to Stremio's server.js file and all modified shortcuts.

### Method 2: CLI Installer (Advanced users)

For users who prefer command-line installation or want to automate the process, we provide a CLI installer script.

#### Prerequisites
- [Deno](https://deno.land/) runtime installed
- Stremio installed on your system

#### Installation Steps

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/MateusAquino/BetterStremio.git
   cd BetterStremio
   ```

2. **Find your Stremio installation path:**
   
   **Windows:**
   ```bash
   # Default path 
   # untested
   
   # Or find manually
   # untested
   ```
   
   **macOS:**
   ```bash
   # Default path
   /Applications/Stremio.app/Contents/MacOS
   
   # Or find manually
   find /Applications -name "stremio" -type f 2>/dev/null
   ```
   
   **Linux:**
   ```bash
   # Common paths
   /opt/stremio/
   /usr/local/stremio/
   /usr/bin/stremio/
   
   # Or find manually
   find / -name "stremio" -type f 2>/dev/null
   ```

3. **Run the CLI installer:**
   
   **Basic installation:**
   ```bash
   deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install
   ```
   
   **Install with extras (WatchParty plugin + Amoled theme):**
   ```bash
   deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install --watchparty --amoled
   ```
   
   **Install to custom path:**
   ```bash
   # Windows
   # untested
   
   # macOS
   deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install "/Applications/Stremio.app/Contents/MacOS"
   
   # Linux
   # untested
   ```

4. **Uninstall BetterStremio:**
   ```bash
   deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts uninstall
   ```

#### CLI Options

| Option | Description |
|--------|-------------|
| `install` | Install BetterStremio |
| `uninstall` | Remove BetterStremio patches |
| `--watchparty` | Also install WatchParty plugin |
| `--amoled` | Also install Amoled theme |
| `--default-path` | Use default Stremio installation path |
| `help` | Show help message |

#### Creating a Convenient Shortcut (macOS/Linux)

Add this function to your shell configuration (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
# BetterStremio shortcut function
stremio-dev() {
    echo "🔄 Killing existing Stremio instances..."
    pkill -f stremio 2>/dev/null || true
    lsof -ti:11470,12470,11471,11472 | xargs kill -9 2>/dev/null || true
    
    echo "⏳ Waiting for ports to be released..."
    sleep 2
    
    echo "🚀 Starting Stremio with BetterStremio development server..."
    /Applications/Stremio.app/Contents/MacOS/stremio --development --streaming-server &
    
    echo "✅ Stremio started with BetterStremio!"
    echo "🌐 Access BetterStremio at: http://localhost:11470"
    echo "📁 BetterStremio folder: ~/.config/BetterStremio"
    
    # Wait and verify
    sleep 3
    if curl -s http://localhost:11470/better-stremio >/dev/null 2>&1; then
        echo "✅ BetterStremio API is responding correctly"
    else
        echo "⚠️  BetterStremio might still be starting up..."
    fi
}
```

Then reload your shell and use:
```bash
stremio-dev
```

> [!TIP]
> The original stremio server can still be used when opening `stremio.exe`. For BetterStremio to work it **must** be opened with the `--development --streaming-server` flags.

For **Linux users**, it is required to run Stremio manually with the flags: `--development --streaming-server`, please add it to your shortcuts.  
Arch Linux was the only distro verified, please contribute to support your own distro.  

If you want to install it manually, or build the installer locally, please check out the Contribute section for more information about how the patching works.

Demo Plugin: https://github.com/MateusAquino/WatchParty  
Demo Theme: https://github.com/REVENGE977/StremioAmoledTheme

## 🔌 Installing Plugins & Themes

After installing BetterStremio, you can enhance your Stremio experience by adding plugins and themes.

### 📁 Plugin & Theme Locations

BetterStremio stores plugins and themes in the following directories:

| Platform | Plugins Path | Themes Path |
|----------|--------------|-------------|
| **Windows** | `%LOCALAPPDATA%\Programs\LNV\Stremio-4\BetterStremio\plugins\` | `%LOCALAPPDATA%\Programs\LNV\Stremio-4\BetterStremio\themes\` |
| **macOS** | `~/.config/BetterStremio/plugins/` | `~/.config/BetterStremio/themes/` |
| **Linux** | `~/.config/BetterStremio/plugins/` | `~/.config/BetterStremio/themes/` |

### 🎯 Installing Plugins

#### Method 1: Using the CLI Installer (Recommended)

Install popular plugins directly with the CLI installer:

```bash
# Install WatchParty plugin
deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install --watchparty

# Install multiple extras at once
deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install --watchparty --amoled
```

#### Method 2: Manual Installation

1. **Download the plugin file** (`.js` extension)
2. **Place it in the plugins directory:**
   
   **Windows:**
   ```cmd
   copy "plugin.js" "%LOCALAPPDATA%\Programs\LNV\Stremio-4\BetterStremio\plugins\"
   ```
   
   **macOS/Linux:**
   ```bash
   cp plugin.js ~/.config/BetterStremio/plugins/
   ```

3. **Restart Stremio** with BetterStremio enabled

#### Method 3: Manual Installation (macOS)

For macOS users who want to install plugins without running the full installer:

**Install WatchParty Plugin:**
```bash
# Create plugins directory if it doesn't exist
mkdir -p ~/.config/BetterStremio/plugins

# Download and install WatchParty
curl -o ~/.config/BetterStremio/plugins/WatchParty.plugin.js \
  https://raw.githubusercontent.com/MateusAquino/WatchParty/refs/heads/main/WatchParty.plugin.js
```

**Install Amoled Theme:**
```bash
# Create themes directory if it doesn't exist
mkdir -p ~/.config/BetterStremio/themes

# Download and install Amoled theme
curl -o ~/.config/BetterStremio/themes/amoled.theme.css \
  https://raw.githubusercontent.com/REVENGE977/StremioAmoledTheme/refs/heads/main/amoled.theme.css
```

**Install both at once:**
```bash
# Create directories
mkdir -p ~/.config/BetterStremio/{plugins,themes}

# Download both
curl -o ~/.config/BetterStremio/plugins/WatchParty.plugin.js \
  https://raw.githubusercontent.com/MateusAquino/WatchParty/refs/heads/main/WatchParty.plugin.js

curl -o ~/.config/BetterStremio/themes/amoled.theme.css \
  https://raw.githubusercontent.com/REVENGE977/StremioAmoledTheme/refs/heads/main/amoled.theme.css
```

After manual installation, restart Stremio with BetterStremio enabled:
```bash
stremio-dev
```

#### Method 4: Using the BetterStremio Web Interface

1. **Start Stremio** with BetterStremio:
   ```bash
   # Using the shortcut function
   stremio-dev
   
   # Or manually
   /Applications/Stremio.app/Contents/MacOS/stremio --development --streaming-server
   ```

2. **Open BetterStremio** in your browser: `http://localhost:11470`

3. **Navigate to the plugins section** and follow the interface instructions

### 🎨 Installing Themes

#### Method 1: Using the CLI Installer

```bash
# Install Amoled theme
deno run --allow-env --allow-net --allow-read --allow-write --allow-run --allow-ffi cli-installer.ts install --amoled
```

#### Method 2: Manual Installation

1. **Download the theme file** (`.css` extension)
2. **Place it in the themes directory:**
   
   **Windows:**
   ```cmd
   copy "theme.css" "%LOCALAPPDATA%\Programs\LNV\Stremio-4\BetterStremio\themes\"
   ```
   
   **macOS/Linux:**
   ```bash
   cp theme.css ~/.config/BetterStremio/themes/
   ```

3. **Restart Stremio** with BetterStremio enabled

### 🔄 Managing Plugins & Themes

#### Enable/Disable Plugins & Themes

1. **Access BetterStremio interface**: `http://localhost:11470`
2. **Navigate to the plugins/themes section**
3. **Toggle plugins/themes** on or off as needed

#### Update Plugins & Themes

BetterStremio supports automatic updates for plugins and themes that include update URLs in their metadata. You can also manually update by:

1. **Download the latest version** of the plugin/theme
2. **Replace the old file** in the appropriate directory
3. **Restart Stremio**

#### Remove Plugins & Themes

Simply delete the plugin (`.js`) or theme (`.css`) file from the respective directory and restart Stremio.

### 📋 Popular Plugins & Themes

#### 🎬 Recommended Plugins

| Plugin | Description | Installation |
|--------|-------------|--------------|
| **WatchParty** | Watch movies/shows with friends | `--watchparty` flag or [download](https://github.com/MateusAquino/WatchParty) |
| **Trakt.tv Integration** | Sync with Trakt.tv | [Download from community](https://github.com/stremio/stremio-addon-client) |
| **IMDb Ratings** | Show IMDb ratings | [Download from community](https://github.com/stremio/stremio-addon-client) |

#### 🎨 Recommended Themes

| Theme | Description | Installation |
|-------|-------------|--------------|
| **Amoled Theme** | Dark theme with true black | `--amoled` flag or [download](https://github.com/REVENGE977/StremioAmoledTheme) |
| **Custom CSS** | Create your own theme | Place `.css` file in themes directory |

### 🛠️ Troubleshooting

#### Plugin/Theme Not Loading

1. **Check file location**: Ensure files are in the correct directory
2. **Verify file format**: Plugins must be `.js`, themes must be `.css`
3. **Check console errors**: Open browser DevTools at `http://localhost:11470`
4. **Restart Stremio**: Always restart after adding new plugins/themes

#### BetterStremio Not Working

1. **Verify installation**: Check if BetterStremio is properly installed
2. **Check Stremio flags**: Ensure Stremio is started with `--development --streaming-server`
3. **Verify API**: Test `http://localhost:11470/better-stremio` in browser
4. **Check logs**: Look for errors in terminal where Stremio is running

#### Finding More Plugins & Themes

- **Community Add-ons**: [Stremio Add-on Client](https://github.com/stremio/stremio-addon-client)
- **GitHub**: Search for "stremio plugin" or "stremio theme"
- **Reddit**: r/StremioAddons community
- **Discord**: Stremio community servers

## 👾 Developing Plugins & Themes

While developing plugins (.js files) and themes (.css files) you should be accessing through the browser at `localhost:11470` for easier reloading and access to Developer Tools.  

### 🎨 Themes
Here's a sample of all theme options (note these @annotations are not required but are a nice to have).

**Sample.theme.css**:
```css
/**
 * @name Amoled Theme
 * @description A theme that uses amoled pitch black color.
 * @image https://github.com/REVENGE977/stremio-enhanced/raw/main/images/amoled_screenshot.png
 * @updateUrl https://raw.githubusercontent.com/REVENGE977/StremioAmoledTheme/main/amoled.theme.css
 * @shareUrl https://github.com/REVENGE977/StremioAmoledTheme
 * @version 1.0.1
 * @author REVENGE977
 */
```
Pitch black Stremio Theme ref: https://github.com/REVENGE977/StremioAmoledTheme

### ⚡ Plugins

Developing plugins is easy, here are all the methods you need for a sample plugin:

**Sample.plugin.js**:
```js
module.exports = class SamplePlugin {   
    getName() {return "Sample BetterStremio Plugin"}
    getImage() {return "https://cdn-icons-png.flaticon.com/512/9908/9908191.png"}
    getDescription() {return "Sample plugin description."}
    getVersion() {return "1.0.0"}
    getAuthor() {return "YourAt"}
    getShareURL() {return "https://github.com/Sample/example"}
    getUpdateURL() {return "https://raw.githubusercontent.com/Sample/example/main/Example.js"}
    onBoot() {}
    onReady() {}
    onLoad() {}
    onEnable() {}
    onDisable() {}
    onSettings() {}
}
```

All of these functions are optional. If you remove `onSettings()` declaration the settings button will be removed from your Plugin.  
Prefer to always use `onLoad` event (when window is loaded), as `onBoot` is executed before the DOM is initialized and `onReady` when the DOM is parsed.  

You can also call functions from your own plugin, eg. for a better enable/disable compatibility:

```js
onEnable() { this.onLoad(); }
```

### 🧩 API

Stremio's web source uses [angular directives](https://www.w3schools.com/angular/angular_ref_directives.asp) behind the scenes, you can use Plain JS or make use of Stremio Root functions exported by BetterStremio (eg. `BetterStremio.StremioRoot`).  
When developing plugins you might need to store/read data or interact with Stremio libs and resources. Here are all default loaded APIs for BetterStremio:

| Mod | Calls | Description |
| --- | ----- | ----------- |
| **BetterStremio** | `host` <br/> `version` <br/> `errors` | Basic Information variables
| **BetterStremio.Data**  |  `store: (plugin, key, value)` <br/> `read: (plugin, key)` <br/> `delete: (plugin, key)` | Read/Store information from storage |
| **BetterStremio.Plugins** | `enable: (plugin)` <br/> `disable: (plugin)` <br/> `reload: ()` | Used internally to control plugin states |
| **BetterStremio.Themes** | `enable: (theme)` <br/> `disable: (theme)` <br/> `reload: ()` | Used internally to control theme states |
| **BetterStremio.Internal** | `fetch: (route='/', async=true)` <br/> `update: (filename, sourceUrl)` <br/> `reloadInfo: ()` <br/> `reloadUI: ()` <br/> <br/> `enabledPlugins` <br/> `enabledThemes` <br/> `enabledThemes` <br/> `plugins` <br/> `themes` | Required functions and variables for BetterStremio loader to handle plugins, themes and autoupdates | 
| **BetterStremio.Toasts** | `error(title, desc, opts)` <br/> `info(title, desc, opts)` <br/> `success(title, desc, opts)` <br/> `warning(title, desc, opts)` | Toasts notification lib used by Stremio
| **BetterStremio.StremioRoot** | Read on DevTools for all states and functions | Used by Stremio's Angular client to control inner states
| **BetterStremio.Player** | Read on DevTools for all states and functions | Video Player used by Stremio.
| **BetterStremio.Sharing** | Read on DevTools for all states and functions | Stremio's sharing module.
| **BetterStremio.Modules** | Read on DevTools for all states and functions | All loaded modules.
| **BetterStremio.Scopes** | Read on DevTools for all states and functions | Stremio scopes from controllers (updates once controller is open).


If you need to use any other libraries or modules from Stremio (metadata, subtitles, windowManager), use the function sample below to import them.
```js 
stremioApp.run([/* libs... */, function (/* callback modules */) => {
    /* Your code */
}])
```

For further information, see examples of `BetterStremio.loader.js` or dive into `blob.js` on Developer Tools to make use of the source code, eg:

![Stremio blob.js from Network Page](https://github.com/MateusAquino/BetterStremio/assets/16140783/3e957108-2c73-452f-b9f4-f9a983a80627)



## 🛠️ TODOs:
- [x] Plugin & Theme loader
- [x] Auto-update for BetterStremio loader
- [x] Interface for plugins (stremio internals & storage)
- [x] Sample plugin & theme
- [x] Installer w/ WebUI
- [x] Windows installer
- [x] Linux installer (verified distros: Arch Linux)
- [ ] MacOS installer (needs contribution)
- [x] Check for updates on plugins & themes (manual)
- [ ] Internationalization

## 🤝 Contribute

This repository is currently available for contributions. If you'd like to help, here are more advanced things to know about how BetterStremio works:

1. The installer patches Stremio's **server.js** file with **patch.js**, updating some routes:
   - `GET /betterstremio/`: Get information about BetterStremio's patch version, path, installed plugins and themes.
   - `GET /betterstremio/folder`: Open plugins/themes folder on user's file explorer.
   - `GET /betterstremio/changelog`: Open BetterStremio's changelog on the browser.
   - `GET /betterstremio/src/:path`: Static sharing of files on BetterStremio's folder.
   - `POST /betterstremio/update/:path?from=URL`: Replaces a file on BetterStremio's folder with the raw content read from the URL for updates.
   - `GET /`: Patched Stremio version, it read contents from "app.strem.io/shell-v4.4" as usual but injects BetterStremio's loader.
2. Patching means to insert these routes into `server.js` and create shortcuts with two arguments for Stremio: `--development --streaming-server` (see: [stremio/stremio-shell](https://github.com/stremio/stremio-shell))
3. BetterStremio loader will automatically update itself on next load (or past 24h) when **BetterStremio.version** is changed in this repository.
4. If you want to ❤️ contribute to develop plugins & themes, note you can run stremio locally in your browser @ `http://localhost:11470` to access Developer Tools.
5. If you want to ❤️ contribute to BetterStremio and its installer, clone this repository and run:

   ```bash
   cd installer
   deno install
   deno task dev # develop the frontend with a mocked interface (check: installer\src\webui.ts)
   deno task build # compiles the frontend to dist/
   deno task compile # (run after deno build) generates a webui executable with a working backend for patching files
   ```
