/** 
 * This is the BetterStremio Loader, responsible for activating plugins and themes.
 * 
 * @see {@link https://github.com/MateusAquino/BetterStremio} for further instructions.
 */

(function boot(){
	BetterStremio.version = "1.0.0";
	BetterStremio.errors = [];

	BetterStremio.Data = {
		store: (plugin, key, value) => localStorage.setItem(`BetterStremio!${plugin}!${key}`, value),
		read: (plugin, key) => localStorage.getItem(`BetterStremio!${plugin}!${key}`),
		delete: (plugin, key) => localStorage.removeItem(`BetterStremio!${plugin}!${key}`)
	};

	BetterStremio.Plugins = {
		enable: (plugin) => {
			if (BetterStremio.Internal.enabledPlugins.includes(plugin)) return;
			BetterStremio.Internal.enabledPlugins.push(plugin);
			BetterStremio.Data.delete("disabled-plugins", plugin);
			try {
				BetterStremio.Internal.plugins[plugin]?.onEnable?.();
			} catch (e) {
				console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onEnable:`, e);
				BetterStremio.errors.push(['onEnable', e]);
			}
		},
		disable: (plugin) => {
			if (!BetterStremio.Internal.enabledPlugins.includes(plugin)) return;
			BetterStremio.Internal.enabledPlugins = BetterStremio.Internal.enabledPlugins.filter(e => e !== plugin);
			BetterStremio.Data.store("disabled-plugins", plugin, "1");
			try {
				BetterStremio.Internal.plugins[plugin]?.onDisable?.();
			} catch (e) {
				console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onDisable:`, e);
				BetterStremio.errors.push(['onDisable', e]);
			}
		},
		reload: () => {
			BetterStremio.Internal.enabledPlugins.forEach((plugin) => {
				try {
					BetterStremio.Internal.plugins[plugin]?.onDisable?.();
				} catch (e) {
					console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onDisable:`, e);
					BetterStremio.errors.push(['onDisable', e]);
				}
			});
			BetterStremio.Internal.reloadInfo();
			BetterStremio.Internal.enabledPlugins.forEach(plugin => {
				try {
					info.plugins[plugin].onEnable?.()
				} catch (e) {
					console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onEnable:`, e);
					BetterStremio.errors.push(['onEnable', e]);
				}
			});
		}
	};

	BetterStremio.Themes = {
		enable: (theme, preserve=true) => {
			const textArea = document.createElement('textarea');
  			textArea.innerText = theme;
  			const themeEscaped = textArea.innerHTML;

  			if (!document.getElementById(`theme-${themeEscaped}`)) {
				const content = BetterStremio.Internal.themes[theme]?.content || "";
				const style = document.createElement('style');
				document.head.appendChild(style);
				style.id = `theme-${themeEscaped}`
				style.type = 'text/css';
				style.appendChild(document.createTextNode(content));
			}

			if (preserve && !BetterStremio.Internal.enabledThemes.includes(theme)) {
				BetterStremio.Internal.enabledThemes.push(theme);
				BetterStremio.Data.delete("disabled-themes", theme);
			}
		},
		disable: (theme, preserve=true) => {
			const textArea = document.createElement('textarea');
  			textArea.innerText = theme;
  			const themeEscaped = textArea.innerHTML;

  			if (sheets = document.getElementById(`theme-${themeEscaped}`)) {
				sheets.remove();
			}

			if (preserve && BetterStremio.Internal.enabledThemes.includes(theme)) {
				BetterStremio.Internal.enabledThemes = BetterStremio.Internal.enabledThemes.filter(e => e !== theme);
				BetterStremio.Data.store("disabled-themes", theme, "1");
			}
		},
		reload: () => {
			BetterStremio.Internal.enabledThemes.forEach(theme => BetterStremio.Themes.disable(theme, false));
			BetterStremio.Internal.reloadInfo();
			BetterStremio.Internal.enabledThemes.forEach(theme => BetterStremio.Themes.enable(theme, false));
		}
	};

	function parseTheme(content) {
		return {
			getName: () => (/@name (.*?)$/m.exec(content) || [])[1],
			getDescription: () => (/@description (.*?)$/m.exec(content) || [])[1],
			getImage: () => (/@image (.*?)$/m.exec(content) || [])[1],
			getUpdateURL: () => (/@updateUrl (.*?)$/m.exec(content) || [])[1],
			getShareURL: () => (/@shareUrl (.*?)$/m.exec(content) || [])[1],
			getVersion: () => (/@version (.*?)$/m.exec(content) || [])[1],
			getAuthor: () => (/@author (.*?)$/m.exec(content) || [])[1],
			content
		}
	}

	BetterStremio.Internal = {
		fetch: (route='/', async=true) => {
			if (async) return fetch(BetterStremio.host + route, { "body": null, "method": "GET" });
	
			const request = new XMLHttpRequest();
			request.open("GET", BetterStremio.host + route, false);
			request.send(null);
			return request?.responseText;
		},
		update: (filename, sourceUrl) => {
			return fetch(BetterStremio.host + `/update/${filename}?from=${encodeURIComponent(sourceUrl)}`, { "body": null, "method": "POST" });
		},
		reloadInfo: () => {
			const info = JSON.parse(BetterStremio.Internal.fetch('/', false))
			const plugins = info.plugins.map(plugin => ([plugin, BetterStremio.Internal.fetch(`/src/plugins/${plugin}`, false)]))
			const themes = info.themes.map(theme => ([theme, parseTheme(BetterStremio.Internal.fetch(`/src/themes/${theme}`, false))]))
			const enabledPlugins = info.plugins.filter(plugin => BetterStremio.Data.read("disabled-plugins", plugin) !== "1");
			const enabledThemes = info.themes.filter(theme => BetterStremio.Data.read("disabled-themes", theme) !== "1");
			const compiledPlugins = [];
			BetterStremio.errors = [];
	
			for (const [pluginName, pluginSource] of plugins) {
				try {
					let module = { exports: {} };
					let exports = module.exports;
    				const PluginModule = eval(pluginSource)
	
					compiledPlugins.push([pluginName, new PluginModule()]);
				} catch (e) {
					console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onImport:`, e);
					BetterStremio.errors.push(['onImport', e]);
				}
			}
	
			BetterStremio.Internal.enabledPlugins = enabledPlugins;
			BetterStremio.Internal.enabledThemes = enabledThemes;
			BetterStremio.Internal.plugins = Object.fromEntries(compiledPlugins);
			BetterStremio.Internal.themes = Object.fromEntries(themes);
			return BetterStremio.Internal;
		}
	};

	const info = BetterStremio.Internal.reloadInfo();

	info.enabledPlugins.forEach(plugin => {
		try {
			info.plugins[plugin].onBoot?.()
		} catch (e) {
			console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onBoot:`, e);
			BetterStremio.errors.push(['onBoot', e]);
		}
	});

	function itemButton() {
		const emptyImage = "data:image/webp;base64,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";

		return `<div ng-repeat="(name, plugin) in type === 'plugins' ? plugins : themes" class="pure-u-1-4 addon ng-scope"><div class="addon-content"><div class="left-pane"><div class="addon-logo"><img alt="Logo" ng-src="{{plugin.getImage() || '${emptyImage}'}}"></div>
		<div class="desc-row"><div class="heading"><h2 class="title">{{plugin.getName() || ""}}</h2>
		<span class="version">v{{plugin.getVersion() || "0.0.0"}}</span></div>
		<div class="addon-type">By: @{{plugin.getAuthor() || "unknown" }}</div>
		<div class="description"><span class="ng-binding">{{plugin.getDescription() || ""}}</span></div></div></div><div class="right-pane">
		<div class="buttons">
			<a ng-hide="!plugin.onSettings" ng-class="!enabled(name) && 'remove'" ng-click="settings(name)" ng-title="translate('ADDON_CONFIGURE')" class="configure small"><svg icon="settings" class="icon" viewBox="0 0 512 512"><path d="M464 250a9.996 9.996 0 0 0-2.9-6.7 10.795 10.795 0 0 0-6.5-3.3l-25.6-4.2a5.867 5.867 0 0 1-3-1.6 5.693 5.693 0 0 1-1.5-3.1c-0.5-3.2-1-6.4-1.7-9.5a5.36 5.36 0 0 1 0.4-3.3 6.633 6.633 0 0 1 2.2-2.5l22.8-12.7c2.26-1.16 4.01-3.12 4.9-5.5 0.93-2.37 0.97-5 0.1-7.4l-3.9-10.9a10.6 10.6 0 0 0-4.8-5.6 10.285 10.285 0 0 0-7.3-0.9l-25.5 5c-1.16 0.18-2.34 0.01-3.4-0.5a5.34 5.34 0 0 1-2.4-2.3c-1.5-2.8-3.1-5.6-4.8-8.4-0.6-0.99-0.88-2.14-0.8-3.3 0.07-1.18 0.53-2.3 1.3-3.2l17-19.6c1.69-1.87 2.68-4.28 2.8-6.8 0.08-2.52-0.78-4.97-2.4-6.9l-7.4-8.9a10.298 10.298 0 0 0-13.6-2l-22.4 13.4c-1 0.58-2.15 0.83-3.3 0.7a5.24 5.24 0 0 1-3.1-1.4c-2.5-2.2-5-4.3-7.4-6.2a5.428 5.428 0 0 1-1.9-2.8c-0.28-1.13-0.21-2.31 0.2-3.4l9.3-24.4c0.99-2.33 1.1-4.95 0.31-7.36s-2.43-4.45-4.61-5.74l-10.1-5.9a10.34 10.34 0 0 0-7.3-1.2 9.96 9.96 0 0 0-6.2 4l-16.4 20.5a5.24 5.24 0 0 1-2.5 1.9c-1.02 0.33-2.13 0.26-3.1-0.2-0.6-0.2-5.8-2.4-9.8-3.7a5.508 5.508 0 0 1-2.7-2 5.31 5.31 0 0 1-1-3.2l0.4-26.1c0.15-2.55-0.63-5.08-2.2-7.1-1.55-2.01-3.8-3.36-6.3-3.8l-11.4-2c-2.49-0.4-5.04 0.09-7.2 1.4a10.49 10.49 0 0 0-4.5 5.8l-8.5 24.8a5.12 5.12 0 0 1-2.1 2.7c-0.98 0.64-2.13 0.96-3.3 0.9h-9.8c-1.15 0.04-2.28-0.31-3.2-1-0.97-0.66-1.7-1.6-2.1-2.7l-8.5-24.7c-0.71-2.43-2.32-4.51-4.5-5.8-2.16-1.3-4.71-1.79-7.2-1.4l-11.5 2c-2.48 0.48-4.72 1.83-6.3 3.8a9.968 9.968 0 0 0-2.2 7l0.4 26.2c-0.01 1.19-0.4 2.34-1.1 3.3-0.73 0.91-1.7 1.61-2.8 2-2.3 0.9-7.3 2.8-9.5 3.6-2 0.7-4.2-0.1-5.9-2.1l-16.3-20a9.96 9.96 0 0 0-6.2-4c-2.49-0.5-5.07-0.11-7.3 1.1l-10.1 5.8c-2.23 1.29-3.9 3.35-4.7 5.8-0.82 2.43-0.68 5.08 0.4 7.4l9.2 24.3c0.43 1.09 0.47 2.29 0.1 3.4-0.28 1.1-0.91 2.09-1.8 2.8-2.4 2-4.9 4-7.4 6.2-0.86 0.78-1.94 1.27-3.09 1.4-1.15 0.13-2.31-0.12-3.31-0.7l-22.1-13.7a10.68 10.68 0 0 0-7.2-1.6c-2.51 0.36-4.79 1.64-6.4 3.6l-7.4 8.9a10.224 10.224 0 0 0-2.4 6.9c0.1 2.53 1.09 4.94 2.8 6.8l17.1 19.6c0.77 0.9 1.23 2.02 1.3 3.2a5.47 5.47 0 0 1-0.8 3.3c-1.7 2.7-3.3 5.6-4.8 8.4a5.793 5.793 0 0 1-2.5 2.4c-1.05 0.51-2.24 0.69-3.4 0.5l-25.5-4.9a10.21 10.21 0 0 0-7.31 0.91c-2.24 1.2-3.94 3.19-4.79 5.59l-4 10.9c-0.92 2.39-0.88 5.04 0.1 7.4 0.92 2.36 2.66 4.31 4.9 5.5l22.8 12.7c1.01 0.57 1.81 1.45 2.3 2.5 0.49 1.06 0.6 2.27 0.3 3.4l-0.2 1.3c-0.5 2.8-1 5.4-1.5 8.2a5.716 5.716 0 0 1-1.5 3c-0.81 0.84-1.86 1.4-3 1.6l-25.7 4.2c-2.51 0.3-4.82 1.51-6.5 3.4a10.22 10.22 0 0 0-2.6 6.9v11.6c-0.01 2.54 0.91 4.99 2.59 6.89 1.67 1.9 3.99 3.11 6.51 3.41l25.7 4.1c1.15 0.18 2.21 0.75 3 1.6 0.81 0.85 1.33 1.94 1.5 3.1 0.5 3.2 1 6.4 1.7 9.5 0.21 1.15 0.08 2.33-0.4 3.4a6.633 6.633 0 0 1-2.2 2.5l-22.8 12.7a10.203 10.203 0 0 0-4.9 5.5c-0.88 2.38-0.92 5-0.1 7.4l4 10.9a10.6 10.6 0 0 0 4.8 5.6c2.24 1.19 4.84 1.52 7.3 0.9l25.6-4.9c1.16-0.23 2.36-0.05 3.4 0.5 1.02 0.5 1.86 1.3 2.4 2.3 1.5 2.8 3.1 5.6 4.8 8.4 0.6 0.99 0.88 2.14 0.8 3.3a5.39 5.39 0 0 1-1.3 3.2l-17 19.6a10.312 10.312 0 0 0-0.5 13.8l7.4 8.9a10.298 10.298 0 0 0 13.6 2l22.4-13.4c1-0.58 2.15-0.83 3.3-0.7 1.16 0.11 2.25 0.6 3.1 1.4 2.5 2.2 5 4.3 7.4 6.2 0.92 0.71 1.58 1.69 1.9 2.8 0.32 1.12 0.28 2.3-0.1 3.4l-9.3 24.4c-0.99 2.33-1.1 4.95-0.31 7.36s2.43 4.45 4.61 5.74l10.1 5.8c2.2 1.29 4.8 1.71 7.3 1.2a9.96 9.96 0 0 0 6.2-4l16.6-20.3c1.4-1.7 3.6-2.5 5.2-1.8 3.5 1.4 5.8 2.2 9.9 3.6 1.09 0.37 2.03 1.07 2.7 2a5.31 5.31 0 0 1 1 3.2l-0.4 26.1a11.3 11.3 0 0 0 2.2 7.1c1.55 2.01 3.8 3.36 6.3 3.8l11.4 2c2.49 0.41 5.04-0.09 7.2-1.4 2.18-1.29 3.79-3.37 4.5-5.8l8.5-24.8a5.12 5.12 0 0 1 2.1-2.7c0.95-0.69 2.13-1.01 3.3-0.9h9.8c1.15-0.04 2.28 0.32 3.2 1 0.97 0.66 1.7 1.6 2.1 2.7l8.5 24.7a10.662 10.662 0 0 0 10 7.4c0.6-0.02 1.21-0.08 1.8-0.2l11.5-2c2.49-0.47 4.72-1.82 6.3-3.8a9.968 9.968 0 0 0 2.2-7l-0.4-26.2c-0.04-1.15 0.31-2.28 1-3.2 0.69-0.91 1.63-1.6 2.7-2 3.8-1.3 6.5-2.3 8.9-3.2l0.6-0.2c3.1-1.1 4.6 0.2 5.5 1.3l16.8 20.6a10.278 10.278 0 0 0 13.5 2.8l10.1-5.8a9.948 9.948 0 0 0 4.6-5.7c0.8-2.42 0.7-5.05-0.3-7.4l-9.2-24.3a5.724 5.724 0 0 1-0.2-3.4 4.88 4.88 0 0 1 1.9-2.8c2.4-2 4.9-4 7.4-6.2 0.87-0.76 1.95-1.25 3.1-1.4 1.15-0.12 2.3 0.13 3.3 0.7l22.4 13.4a10.68 10.68 0 0 0 7.2 1.6c2.51-0.36 4.79-1.64 6.4-3.6l7.4-8.9c1.64-1.95 2.5-4.45 2.4-7-0.1-2.53-1.09-4.94-2.8-6.8l-17.1-19.7c-0.76-0.89-1.21-2-1.3-3.17-0.09-1.17 0.19-2.33 0.8-3.33 1.7-2.7 3.3-5.6 4.8-8.4a6.48 6.48 0 0 1 2.5-2.4c1.05-0.51 2.24-0.69 3.4-0.5l25.5 5c2.46 0.62 5.07 0.3 7.31-0.9 2.24-1.2 3.95-3.2 4.79-5.6l3.9-10.9c0.92-2.39 0.88-5.04-0.1-7.4-0.92-2.36-2.66-4.31-4.9-5.5l-22.8-12.7a5.568 5.568 0 0 1-2.3-2.5c-0.5-1.06-0.6-2.27-0.3-3.4l0.2-1.3c0.5-2.8 1-5.4 1.5-8.2 0.19-1.13 0.71-2.17 1.5-3 0.81-0.84 1.86-1.4 3-1.6l25.7-4.1c2.51-0.3 4.82-1.51 6.5-3.4 1.69-1.9 2.62-4.36 2.6-6.9v-11.8h-0.1Zm-282.4 94a15.52 15.52 0 0 1-5.1 5.4c-2.1 1.37-4.5 2.23-7 2.5-2.48 0.27-4.99-0.07-7.3-1-2.34-0.9-4.43-2.34-6.1-4.2a135.028 135.028 0 0 1-34.9-90.88 135.02 135.02 0 0 1 35.3-90.72c1.67-1.86 3.76-3.3 6.1-4.2 2.32-0.89 4.83-1.2 7.3-0.9 2.5 0.27 4.9 1.13 7 2.5a16.56 16.56 0 0 1 5.1 5.4l45.6 80.4c1.38 2.41 2.1 5.13 2.1 7.9 0 2.77-0.72 5.49-2.1 7.9l-46 79.9Zm74.4 47.2c-9.51 0-19-1-28.3-3a15.522 15.522 0 0 1-11-9.1c-0.97-2.27-1.41-4.73-1.3-7.2 0.13-2.47 0.85-4.87 2.1-7l46-80c1.4-2.4 3.4-4.4 5.8-5.8 2.4-1.39 5.13-2.12 7.9-2.1h92.1c2.47 0.01 4.9 0.59 7.1 1.7a15.9 15.9 0 0 1 5.6 4.7c1.47 2.02 2.46 4.34 2.9 6.8 0.39 2.44 0.22 4.94-0.5 7.3-17.5 54.2-68.4 93.7-128.4 93.7Zm7.5-163.9L218 147.0999999999999a17.248 17.248 0 0 1-2.1-7c-0.22-3.72 0.91-7.4 3.16-10.37 2.25-2.97 5.5-5.04 9.14-5.83 9.11-1.91 18.39-2.89 27.7-2.9 60 0 110.9 39.4 128.4 93.8 0.71 2.37 0.88 4.86 0.5 7.3-0.41 2.45-1.4 4.77-2.88 6.77-1.47 1.99-3.4 3.62-5.62 4.73-2.21 1.1-4.63 1.68-7.1 1.7h-92c-2.8 0-5.56-0.72-8-2.1-2.33-1.5-4.28-3.52-5.7-5.9Z" style="fill:currentcolor"></path></svg></a>
			<a ng-hide="!enabled(name)" ng-click="disable(name)" class="install">Enabled</a>
			<a ng-hide="enabled(name)" ng-click="enable(name)" class="remove">Disabled</a>
		</div>
		<div ng-hide="!plugin.getShareURL" ng-click="share(name)" class="share"><svg icon="share" class="icon" viewBox="0 0 512 512"><path d="M396 459.9000000000001a68.732 68.732 0 0 1-69.2-67.7v-1.5l-138.3-45.6a78.017 78.017 0 0 1-27.51 21.83 78.18 78.18 0 0 1-34.29 7.57c-20.25 0.8-39.99-6.47-54.89-20.22a76.497 76.497 0 0 1-4.45-108.01 76.464 76.464 0 0 1 53.04-24.67c2.1-0.1 4.2-0.1 6.3 0 17.47 0.17 34.44 5.84 48.5 16.2l101.7-66.2c-6.3-12.85-9.81-26.89-10.3-41.2-0.9-19.1 3.94-38.03 13.9-54.36a95.752 95.752 0 0 1 41.98-37.23 95.712 95.712 0 0 1 55.62-7.3 95.675 95.675 0 0 1 50.17 25.13 95.68 95.68 0 0 1 27.46 48.92 95.708 95.708 0 0 1-4.68 55.91 95.622 95.622 0 0 1-35.21 43.69 95.744 95.744 0 0 1-53.64 16.44c-12.24 0.2-24.4-2.04-35.77-6.59a92.241 92.241 0 0 1-30.43-19.91l-100 64.7a77.105 77.105 0 0 1 8.8 35.2 94.128 94.128 0 0 1-2.9 19.1l132.3 42.6a70.112 70.112 0 0 1 33.27-29.66 70.06 70.06 0 0 1 44.42-3.6 70.09 70.09 0 0 1 37.62 23.91 70.124 70.124 0 0 1 15.59 41.75 71.267 71.267 0 0 1-20.28 49.33 71.293 71.293 0 0 1-48.82 21.47Zm0-104.4c-6.91 0.3-13.57 2.62-19.17 6.68-5.6 4.05-9.88 9.67-12.32 16.14a35.341 35.341 0 0 0-1.38 20.25 35.271 35.271 0 0 0 63.85 11.58 35.212 35.212 0 0 0 5.82-19.45 36.1 36.1 0 0 0-11.14-25.19 36.103 36.103 0 0 0-25.66-10.01Zm-270.6-102.9a45.61 45.61 0 0 0-17.53 3.05 45.73 45.73 0 0 0-15.04 9.53 45.821 45.821 0 0 0-10.24 14.55 45.61 45.61 0 0 0-0.84 34.9 45.73 45.73 0 0 0 9.53 15.04c4.13 4.33 9.08 7.81 14.55 10.24a45.644 45.644 0 0 0 17.37 3.89h2.2c5.99 0.14 11.95-0.89 17.53-3.05a45.73 45.73 0 0 0 15.04-9.53c4.33-4.13 7.81-9.08 10.24-14.55a45.644 45.644 0 0 0 3.89-17.37c0.15-5.99-0.89-11.95-3.05-17.53a45.73 45.73 0 0 0-9.53-15.04 45.821 45.821 0 0 0-14.55-10.24 45.644 45.644 0 0 0-17.37-3.89h-2.2Zm236.8-180.9a61.296 61.296 0 0 0-23.57 3.89 61.023 61.023 0 0 0-20.29 12.62 61.108 61.108 0 0 0-13.92 19.42 61.166 61.166 0 0 0-5.42 23.27v1.1a61.285 61.285 0 0 0 18.62 43.02 61.309 61.309 0 0 0 43.58 17.28h1.1c8.16 0.39 16.32-0.89 23.98-3.75a60.44 60.44 0 0 0 20.56-12.88 60.422 60.422 0 0 0 13.83-19.95c3.21-7.51 4.86-15.6 4.86-23.77a60.49 60.49 0 0 0-4.9-23.77 60.334 60.334 0 0 0-34.45-32.77 60.305 60.305 0 0 0-23.98-3.71Z" style="fill:currentcolor"></path></svg>Share {{type === "plugins" ? "Plugin" : "Theme"}}</div>
		<div ng-hide="true" ng-click="update(name)" class="share"><svg viewBox="0 0 256 256" class="icon"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"><g transform="scale(8,8)"><path d="M16,4c-6.61719,0 -12,5.38281 -12,12h2c0,-5.51562 4.48438,-10 10,-10c3.69531,0 6.92578,2.01172 8.65625,5h-3.65625v2h7v-7h-2v3.40625c-2.14453,-3.25391 -5.82031,-5.40625 -10,-5.40625zM26,16c0,5.51563 -4.48437,10 -10,10c-3.69531,0 -6.92578,-2.01172 -8.65625,-5h3.65625v-2h-7v7h2v-3.40625c2.14453,3.25391 5.82031,5.40625 10,5.40625c6.61719,0 12,-5.38281 12,-12z"></path></g></g></svg>Update Available</div>
		</div></div></div>`;
	}

	document.addEventListener("DOMContentLoaded", () => {
		info.enabledThemes.forEach(theme => BetterStremio.Themes.enable(theme, false));

		const betterStremioTpl = document.createElement("script");
		betterStremioTpl.id = "betterStremioTpl";
		betterStremioTpl.type = "text/ng-template";
		betterStremioTpl.innerHTML = `<div ng-controller="betterStremioCtrl" ng-cloak><div id="addonsCatalog"><div id="addons"><div id="betterstremio-filters" spatial-nav-section="{ id: 'betterstremio-filters', enterTo: 'last-focused'}" spatial-nav-section-active="$state.includes('betterstremio') &amp;&amp; ! prompt" class="options"><div class="filters"><ul class="segments"><li ng-repeat="type in ['plugins', 'themes']" ui-sref="betterstremio({ type: type })" ui-sref-opts="{location: 'replace'}" ng-class="{ selected: type == getSelectedType() }" tabindex="-1"><span ng-if="type == 'plugins'" translate="Plugins" class="label"> </span><span ng-if="type == 'themes'" translate="Themes" class="label"></span></li></ul></div><div class="filters"><span id="betterstremio-version" style="margin-top: 0.5rem;margin-right: 10px;align-items: center;display: flex;color: gray;font-size: 10px;flex-wrap: nowrap;flex-direction: column;">BetterStremio v${BetterStremio.version}<a href="https://github.com/MateusAquino/BetterStremio/blob/main/CHANGELOG.md" style="color: palegoldenrod;">(changelog)</a></span><ul class="segments"><li ng-click="reloadAll()" tabindex="-1"><span class="label">Reload</span></li><li ng-click="openFolder()" tabindex="-1"><span class="label">Open folder</span></li></ul></div></div><div ng-repeat="type in ['plugins', 'themes']" ng-hide="type != getSelectedType()" class="content">${itemButton()}</div></div></div></div>`
        
        const addonsTpl = document.getElementById('addonsTpl');
        addonsTpl.parentElement.insertBefore(betterStremioTpl, addonsTpl);


		stremioApp.run(["$rootScope", "toasts", "player", function(root, toasts, player) {
		    BetterStremio.StremioRoot = root;
		    BetterStremio.StremioRoot.tabs.splice(5, 0, {id: 6, name: 'BetterStremio', icon: 'betterstremio', route: 'betterstremio'});
		    BetterStremio.Toasts = toasts;
		    BetterStremio.Player = player;
		}]);

		stremioApp.config(["$stateProvider", function(t) {
			t.state({
    		    name: "betterstremio",
    		    url: "/betterstremio/:type",
    		    params: {
    		    	type: "plugins"
        		}, views: {
        		    view: {
        		        templateUrl: "betterStremioTpl"
        		    }
        		},
    		})
		}]);

		stremioApp.controller("betterStremioCtrl", ["$scope", "$state", "sharing", function(s, m, d) {
			const context = () => m.params.type === "plugins" ? BetterStremio.Plugins : BetterStremio.Themes;
			const enabledValues = () => m.params.type === "plugins" ? BetterStremio.Internal.enabledPlugins : BetterStremio.Internal.enabledThemes;
			const entries = () => m.params.type === "plugins" ? BetterStremio.Internal.plugins : BetterStremio.Internal.themes;

	        s.getSelectedType = () => m.params.type
	        s.getCatalogs = () => ["plugins", "themes"];

	        s.themes = BetterStremio.Internal.themes;
	        s.plugins = BetterStremio.Internal.plugins;
	        s.reloadAll = () => context().reload()
	        s.enable = (name) => context().enable(name)
	        s.disable = (name) => context().disable(name)
	        s.settings = (name) => entries()[name].onSettings()
	        s.enabled = (name) => enabledValues().includes(name)
	        s.openFolder = () => BetterStremio.Internal.fetch('/folder', false)
	        s.update = (name) => window.open(entries()[name].getUpdateURL(), '_blank').focus()
	        s.share = (name) => {
	        	 d.sendShare({
                	url: entries()[name].getShareURL(),
                	name: entries()[name].getName(),
                	type: 'copylink'
            	})
	        }
	    }])

		info.enabledPlugins.forEach(plugin => {
			try {
				info.plugins[plugin].onReady?.()
			} catch (e) {
				console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onReady:`, e);
				BetterStremio.errors.push(['onReady', e]);
			}
		});
	});

	function checkForUpdates() {
		const updateURL = "https://raw.githubusercontent.com/MateusAquino/BetterStremio/main/BetterStremio.loader.js";
		fetch(updateURL, { "body": null, "method": "GET" }).then(async (res) => {
			const loader = await res.text();
			const match = /BetterStremio\.version\s*=\s*"(.*?)"/gm.exec(loader);
			if (match && match[1] && match[1] !== BetterStremio.version) {
				BetterStremio.Internal.update('BetterStremio.loader.js', updateURL)
				BetterStremio.Toasts.info(`BetterStremio update available!", "Close Stremio from system tray and reopen to upgrade to v${match[1]}.`)
			} else if (match && match[1])
				console.log(`[BetterStremio] Running latest version. (v${match[1]})`)
			else
				console.error(`[BetterStremio] Couldn't fetch version from loader content:`, loader)
		}).catch((e) => {
			console.error("[BetterStremio] Failed to check for updates", e)
		});
	};

	window.onload = () => {
		setTimeout(() => checkForUpdates(), 2000)
		setInterval(() => checkForUpdates(), 86400000)
		const outlineIcon = document.querySelector('[icon="betterstremio-outline"]');
		const filledIcon = document.querySelector('[icon="betterstremio"]');
		outlineIcon.innerHTML = `<g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M14,3c-1.64497,0 -3,1.35503 -3,3v15.02539c-4.44462,0.26245 -8,3.96685 -8,8.47461c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683c0,-2.8862 2.18298,-5.22619 5,-5.47656v12.97656c0,1.64497 1.35503,3 3,3h4v5.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-5.5h8v5.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-5.5h4c1.64497,0 3,-1.35503 3,-3v-13.02539c4.44461,-0.26245 8,-3.96685 8,-8.47461c0.00582,-0.40562 -0.15288,-0.7963 -0.43991,-1.08296c-0.28703,-0.28666 -0.67792,-0.44486 -1.08353,-0.43852c-0.82766,0.01293 -1.48843,0.69381 -1.47656,1.52148c0,2.8862 -2.18298,5.22619 -5,5.47656v-14.97656c0,-1.64497 -1.35503,-3 -3,-3zM14,5h22c0.56503,0 1,0.43497 1,1v16.25391c-0.02645,0.16103 -0.02645,0.3253 0,0.48633v14.25977c0,0.56503 -0.43497,1 -1,1h-22c-0.56503,0 -1,-0.43497 -1,-1v-14.25391c0.02645,-0.16103 0.02645,-0.3253 0,-0.48633v-16.25977c0,-0.56503 0.43497,-1 1,-1zM17,7c-1.09306,0 -2,0.90694 -2,2v9c0,1.09306 0.90694,2 2,2h16c1.09306,0 2,-0.90694 2,-2v-9c0,-1.09306 -0.90694,-2 -2,-2zM17,9h16v9h-16zM20,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM30,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM23,14c0,1.105 0.895,2 2,2c1.105,0 2,-0.895 2,-2zM15,22v2h12v-2zM32,22c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM17,26v2h-2v2h2v2h2v-2h2v-2h-2v-2zM29,26l-2,3h4zM34,27c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1zM31.5,31c-1.381,0 -2.5,1.119 -2.5,2.5c0,1.381 1.119,2.5 2.5,2.5c1.381,0 2.5,-1.119 2.5,-2.5c0,-1.381 -1.119,-2.5 -2.5,-2.5zM16,34c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h2c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587zM22,34c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h2c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587z"></path></g></g>`
		filledIcon.innerHTML = `<g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M14,4c-1.105,0 -2,0.895 -2,2v15h-0.5c-4.67666,0 -8.5,3.82334 -8.5,8.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683c0,-3.05534 2.44466,-5.5 5.5,-5.5h0.5v13c0,1.105 0.895,2 2,2h4v6.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-6.5h8v6.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-6.5h4c1.105,0 2,-0.895 2,-2v-13h0.5c0.21371,0.00241 0.42547,-0.04088 0.62109,-0.12695c4.37381,-0.33661 7.87891,-3.91645 7.87891,-8.37305c0.00582,-0.40562 -0.15288,-0.7963 -0.43991,-1.08296c-0.28703,-0.28666 -0.67792,-0.44486 -1.08353,-0.43852c-0.82766,0.01293 -1.48843,0.69381 -1.47656,1.52148c0,3.05534 -2.44466,5.5 -5.5,5.5h-0.5v-15c0,-1.105 -0.895,-2 -2,-2zM17,8h16c0.552,0 1,0.448 1,1v9c0,0.552 -0.448,1 -1,1h-16c-0.552,0 -1,-0.448 -1,-1v-9c0,-0.552 0.448,-1 1,-1zM20,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM30,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM23,14c0,1.105 0.895,2 2,2c1.105,0 2,-0.895 2,-2zM16,22h11v2h-11zM32,22c0.552,0 1,0.448 1,1c0,0.552 -0.448,1 -1,1c-0.552,0 -1,-0.448 -1,-1c0,-0.552 0.448,-1 1,-1zM18,26h2v2h2v2h-2v2h-2v-2h-2v-2h2zM29,26l2,3h-4zM34,27c0.552,0 1,0.448 1,1c0,0.552 -0.448,1 -1,1c-0.552,0 -1,-0.448 -1,-1c0,-0.552 0.448,-1 1,-1zM31.5,31c1.381,0 2.5,1.119 2.5,2.5c0,1.381 -1.119,2.5 -2.5,2.5c-1.381,0 -2.5,-1.119 -2.5,-2.5c0,-1.381 1.119,-2.5 2.5,-2.5zM17,34h2c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1h-2c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1zM23,34h2c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1h-2c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1z"></path></g></g>`
		outlineIcon.setAttribute("viewBox", "0 0 256 256")
		filledIcon.setAttribute("viewBox", "0 0 256 256")

		info.enabledPlugins.forEach(plugin => {
			try {
				info.plugins[plugin].onLoad?.()
			} catch (e) {
				console.error(`[BetterStremio] Plugin '${plugin}' threw an exception at onLoad:`, e);
				BetterStremio.errors.push(['onLoad', e]);
			}
		});
	};
})()
