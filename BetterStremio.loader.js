/**
 * This is the BetterStremio Loader, responsible for activating plugins and themes.
 *
 * @see {@link https://github.com/MateusAquino/BetterStremio} for further instructions.
 */

(function boot() {
  BetterStremio.version = "1.1.0-dev";
  BetterStremio.errors = [];

  BetterStremio.Modules = {};
  BetterStremio.Factories = {};
  BetterStremio.Directives = {};
  BetterStremio.Registry = {};
  BetterStremio.Decorators = {};
  BetterStremio.Services = {};
  BetterStremio.Scopes = {};
  BetterStremio.Icons = {
    betterstremio: {
      viewBox: "0 0 256 256",
      paths: [
        {
          d: "M14,4c-1.105,0 -2,0.895 -2,2v15h-0.5c-4.67666,0 -8.5,3.82334 -8.5,8.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683c0,-3.05534 2.44466,-5.5 5.5,-5.5h0.5v13c0,1.105 0.895,2 2,2h4v6.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-6.5h8v6.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-6.5h4c1.105,0 2,-0.895 2,-2v-13h0.5c0.21371,0.00241 0.42547,-0.04088 0.62109,-0.12695c4.37381,-0.33661 7.87891,-3.91645 7.87891,-8.37305c0.00582,-0.40562 -0.15288,-0.7963 -0.43991,-1.08296c-0.28703,-0.28666 -0.67792,-0.44486 -1.08353,-0.43852c-0.82766,0.01293 -1.48843,0.69381 -1.47656,1.52148c0,3.05534 -2.44466,5.5 -5.5,5.5h-0.5v-15c0,-1.105 -0.895,-2 -2,-2zM17,8h16c0.552,0 1,0.448 1,1v9c0,0.552 -0.448,1 -1,1h-16c-0.552,0 -1,-0.448 -1,-1v-9c0,-0.552 0.448,-1 1,-1zM20,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM30,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM23,14c0,1.105 0.895,2 2,2c1.105,0 2,-0.895 2,-2zM16,22h11v2h-11zM32,22c0.552,0 1,0.448 1,1c0,0.552 -0.448,1 -1,1c-0.552,0 -1,-0.448 -1,-1c0,-0.552 0.448,-1 1,-1zM18,26h2v2h2v2h-2v2h-2v-2h-2v-2h2zM29,26l2,3h-4zM34,27c0.552,0 1,0.448 1,1c0,0.552 -0.448,1 -1,1c-0.552,0 -1,-0.448 -1,-1c0,-0.552 0.448,-1 1,-1zM31.5,31c1.381,0 2.5,1.119 2.5,2.5c0,1.381 -1.119,2.5 -2.5,2.5c-1.381,0 -2.5,-1.119 -2.5,-2.5c0,-1.381 1.119,-2.5 2.5,-2.5zM17,34h2c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1h-2c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1zM23,34h2c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1h-2c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1z",
          style: "fill:currentcolor;transform:scale(5.12,5.12);",
        },
      ],
    },
    "betterstremio-outline": {
      viewBox: "0 0 256 256",
      paths: [
        {
          d: "M14,3c-1.64497,0 -3,1.35503 -3,3v15.02539c-4.44462,0.26245 -8,3.96685 -8,8.47461c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683c0,-2.8862 2.18298,-5.22619 5,-5.47656v12.97656c0,1.64497 1.35503,3 3,3h4v5.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-5.5h8v5.5c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-5.5h4c1.64497,0 3,-1.35503 3,-3v-13.02539c4.44461,-0.26245 8,-3.96685 8,-8.47461c0.00582,-0.40562 -0.15288,-0.7963 -0.43991,-1.08296c-0.28703,-0.28666 -0.67792,-0.44486 -1.08353,-0.43852c-0.82766,0.01293 -1.48843,0.69381 -1.47656,1.52148c0,2.8862 -2.18298,5.22619 -5,5.47656v-14.97656c0,-1.64497 -1.35503,-3 -3,-3zM14,5h22c0.56503,0 1,0.43497 1,1v16.25391c-0.02645,0.16103 -0.02645,0.3253 0,0.48633v14.25977c0,0.56503 -0.43497,1 -1,1h-22c-0.56503,0 -1,-0.43497 -1,-1v-14.25391c0.02645,-0.16103 0.02645,-0.3253 0,-0.48633v-16.25977c0,-0.56503 0.43497,-1 1,-1zM17,7c-1.09306,0 -2,0.90694 -2,2v9c0,1.09306 0.90694,2 2,2h16c1.09306,0 2,-0.90694 2,-2v-9c0,-1.09306 -0.90694,-2 -2,-2zM17,9h16v9h-16zM20,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM30,11c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM23,14c0,1.105 0.895,2 2,2c1.105,0 2,-0.895 2,-2zM15,22v2h12v-2zM32,22c-0.55228,0 -1,0.44772 -1,1c0,0.55228 0.44772,1 1,1c0.55228,0 1,-0.44772 1,-1c0,-0.55228 -0.44772,-1 -1,-1zM17,26v2h-2v2h2v2h2v-2h2v-2h-2v-2zM29,26l-2,3h4zM34,27c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1zM31.5,31c-1.381,0 -2.5,1.119 -2.5,2.5c0,1.381 1.119,2.5 2.5,2.5c1.381,0 2.5,-1.119 2.5,-2.5c0,-1.381 -1.119,-2.5 -2.5,-2.5zM16,34c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h2c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587zM22,34c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h2c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587z",
          style: "fill:currentcolor;transform: scale(5.12,5.12)",
        },
      ],
    },
  };

  BetterStremio.monkeyPatch = (ctrl, fn) => {
    if (BetterStremio.Internal.events.onInvoke === undefined)
      BetterStremio.Internal.events.onInvoke = [];
    BetterStremio.Internal.events.onInvoke.push({ ctrl, fn });
  };

  BetterStremio.createTemplate = (templateName, html) => {
    const tpl = document.createElement("script");
    tpl.id = templateName;
    tpl.type = "text/ng-template";
    tpl.innerHTML = html;
    const addonsTpl = document.getElementById("addonsTpl");
    addonsTpl.parentElement.insertBefore(tpl, addonsTpl);
  };

  BetterStremio.Data = {
    store: (plugin, key, value) =>
      localStorage.setItem(`BetterStremio!${plugin}!${key}`, value),
    read: (plugin, key) =>
      localStorage.getItem(`BetterStremio!${plugin}!${key}`),
    delete: (plugin, key) =>
      localStorage.removeItem(`BetterStremio!${plugin}!${key}`),
  };

  BetterStremio.Plugins = {
    enable: (plugin) => {
      if (BetterStremio.Internal.enabledPlugins.includes(plugin)) return;
      BetterStremio.Internal.enabledPlugins.push(plugin);
      BetterStremio.Data.delete("disabled-plugins", plugin);
      try {
        BetterStremio.Internal.plugins[plugin]?.onEnable?.();
        const internalTheme = BetterStremio.Internal.plugins[plugin]?.styles;
        if (internalTheme) {
          const safeName = plugin.replace(/[^a-z0-9 _\.]/gi, "");
          const style = `<style type="text/css" data-plugin="${safeName}" class="bs-internal-styles">${internalTheme}</style>`;
          document.body.insertAdjacentHTML("afterbegin", style);
        }
      } catch (e) {
        console.error(
          `[BetterStremio] Plugin '${plugin}' threw an exception at onEnable:`,
          e
        );
        BetterStremio.errors.push(["onEnable", e]);
      }
    },
    disable: (plugin) => {
      if (!BetterStremio.Internal.enabledPlugins.includes(plugin)) return;
      BetterStremio.Internal.enabledPlugins =
        BetterStremio.Internal.enabledPlugins.filter((e) => e !== plugin);
      BetterStremio.Data.store("disabled-plugins", plugin, "1");
      try {
        BetterStremio.Internal.plugins[plugin]?.onDisable?.();
        const safeName = plugin.replace(/[^a-z0-9 _\.]/gi, "");
        document
          .querySelector(`.bs-internal-styles[data-plugin="${safeName}"]`)
          ?.remove();
      } catch (e) {
        console.error(
          `[BetterStremio] Plugin '${plugin}' threw an exception at onDisable:`,
          e
        );
        BetterStremio.errors.push(["onDisable", e]);
      }
    },
    reload: async () => {
      BetterStremio.Internal.enabledPlugins.forEach((plugin) => {
        try {
          BetterStremio.Internal.plugins[plugin]?.onDisable?.(true);
          const safeName = plugin.replace(/[^a-z0-9 _\.]/gi, "");
          document
            .querySelector(`.bs-internal-styles[data-plugin="${safeName}"]`)
            ?.remove();
        } catch (e) {
          console.error(
            `[BetterStremio] Plugin '${plugin}' threw an exception at onDisable:`,
            e
          );
          BetterStremio.errors.push(["onDisable", e]);
        }
      });
      BetterStremio.Internal.reloadInfo();
      BetterStremio.Internal.enabledPlugins.forEach((plugin) => {
        try {
          info.plugins[plugin].onEnable?.(true);
          const internalTheme = info.plugins[plugin]?.styles;
          if (internalTheme) {
            const safeName = plugin.replace(/[^a-z0-9 _\.]/gi, "");
            const style = `<style type="text/css" data-plugin="${safeName}" class="bs-internal-styles">${internalTheme}</style>`;
            document.body.insertAdjacentHTML("afterbegin", style);
          }
        } catch (e) {
          console.error(
            `[BetterStremio] Plugin '${plugin}' threw an exception at onEnable:`,
            e
          );
          BetterStremio.errors.push(["onEnable", e]);
        }
      });
      await checkPluginUpdates();
      BetterStremio.Internal.refreshCtrl();
    },
  };

  BetterStremio.Themes = {
    enable: (theme, preserve = true) => {
      const textArea = document.createElement("textarea");
      textArea.innerText = theme;
      const themeEscaped = textArea.innerHTML;

      if (!document.getElementById(`theme-${themeEscaped}`)) {
        const content = BetterStremio.Internal.themes[theme]?.content || "";
        const style = document.createElement("style");
        document.head.appendChild(style);
        style.id = `theme-${themeEscaped}`;
        style.appendChild(document.createTextNode(content));
      }

      if (preserve && !BetterStremio.Internal.enabledThemes.includes(theme)) {
        BetterStremio.Internal.enabledThemes.push(theme);
        BetterStremio.Data.delete("disabled-themes", theme);
      }
    },
    disable: (theme, preserve = true) => {
      const textArea = document.createElement("textarea");
      textArea.innerText = theme;
      const themeEscaped = textArea.innerHTML;

      if ((sheets = document.getElementById(`theme-${themeEscaped}`))) {
        sheets.remove();
      }

      if (preserve && BetterStremio.Internal.enabledThemes.includes(theme)) {
        BetterStremio.Internal.enabledThemes =
          BetterStremio.Internal.enabledThemes.filter((e) => e !== theme);
        BetterStremio.Data.store("disabled-themes", theme, "1");
      }
    },
    reload: async () => {
      BetterStremio.Internal.enabledThemes.forEach((theme) =>
        BetterStremio.Themes.disable(theme, false)
      );
      BetterStremio.Internal.reloadInfo();
      BetterStremio.Internal.enabledThemes.forEach((theme) =>
        BetterStremio.Themes.enable(theme, false)
      );
      await checkThemeUpdates();
      BetterStremio.Internal.refreshCtrl();
    },
  };

  function parseTheme(content) {
    return {
      getName: () => (/@name (.*?)$/m.exec(content) || [])[1],
      getDescription: () => (/@description (.*?)$/m.exec(content) || [])[1],
      getImage: () => (/@image (.*?)$/m.exec(content) || [])[1],
      getUpdateURL: () => (/@updateUrl (.*?)$/m.exec(content) || [])[1],
      getShareURL: () =>
        (/@shareUrl (.*?)$/m.exec(content) || [])[1] ||
        (/@updateUrl (.*?)$/m.exec(content) || [])[1],
      getVersion: () => (/@version (.*?)$/m.exec(content) || [])[1],
      getAuthor: () => (/@author (.*?)$/m.exec(content) || [])[1],
      content,
    };
  }

  BetterStremio.Internal = {
    events: {},
    installablesCache: {},
    fetch: (route = "/", async = true) => {
      const noCache = "v=" + Date.now();
      const updateURL = BetterStremio.host + route;
      const updateURLNoCache = updateURL.includes("?")
        ? updateURL + "&" + noCache
        : updateURL + "?" + noCache;

      if (async) return fetch(updateURLNoCache, { body: null, method: "GET" });

      const request = new XMLHttpRequest();
      request.open("GET", updateURLNoCache, false);
      request.send(null);
      return request?.responseText;
    },
    update: (filename, sourceUrl) =>
      fetch(
        `${BetterStremio.host}/update/${filename}?from=${encodeURIComponent(
          sourceUrl
        )}`,
        { body: null, method: "POST" }
      ),
    delete: (filename) => {
      if (BetterStremio.patch_version < 2)
        return BetterStremio.Toasts.error(
          "Outdated Patch Version",
          "Please reinstall/repair BetterStremio to use this feature."
        );
      return fetch(`${BetterStremio.host}/update/${filename}`, {
        body: null,
        method: "DELETE",
      });
    },
    reloadUI: () => {
      t = new URLSearchParams(location.search);
      t.set("cacheBreak", Math.floor(new Date().getTime()));
      location.search = t;
    },
    reloadInfo: () => {
      const noCache = "v=" + Date.now();
      const info = JSON.parse(
        BetterStremio.Internal.fetch(`/?${noCache}`, false)
      );
      const plugins = info.plugins.map((plugin) => [
        plugin,
        BetterStremio.Internal.fetch(
          `/src/plugins/${plugin}?${noCache}`,
          false
        ),
      ]);
      const themes = info.themes.map((theme) => [
        theme,
        parseTheme(
          BetterStremio.Internal.fetch(`/src/themes/${theme}?${noCache}`, false)
        ),
      ]);
      const enabledPlugins = info.plugins.filter(
        (plugin) => BetterStremio.Data.read("disabled-plugins", plugin) !== "1"
      );
      const enabledThemes = info.themes.filter(
        (theme) => BetterStremio.Data.read("disabled-themes", theme) !== "1"
      );
      BetterStremio.patch_version = info.v;
      const compiledPlugins = [];
      BetterStremio.errors = [];

      for (const [pluginName, pluginSource] of plugins) {
        try {
          const PluginModule = new Function(
            `let module = { exports: {} };let exports = module.exports; return ${pluginSource}\n//# sourceURL=${BetterStremio.host}/src/plugins/${pluginName}`
          )();
          compiledPlugins.push([pluginName, new PluginModule()]);
        } catch (e) {
          var err = e.constructor(
            `[BetterStremio] Plugin '${pluginName}' failed to compile: ${e.message}`
          );
          console.error(err);
          BetterStremio.errors.push(["onImport", e]);
          const PluginModule = new Function(
            `let module = { exports: class InvalidPlugin { getName = () => "${pluginName}"; getDescription = () => "This plugin failed to compile. Please check the console and/or BetterStremio plugin template for more information." } };let exports = module.exports; return module.exports;\n//# sourceURL=${BetterStremio.host}/src/plugins/${pluginName}`
          )();
          compiledPlugins.push([pluginName, new PluginModule()]);
        }
      }

      BetterStremio.Internal.enabledPlugins = enabledPlugins;
      BetterStremio.Internal.enabledThemes = enabledThemes;
      BetterStremio.Internal.plugins = Object.fromEntries(compiledPlugins);
      BetterStremio.Internal.themes = Object.fromEntries(themes);
      return BetterStremio.Internal;
    },
    refreshCtrl: () => {
      BetterStremio.Scopes.betterStremioCtrl?.$state?.reload?.();
      document.querySelector("#bs-notification-count")?.remove?.();
      const updateCount =
        Object.values(BetterStremio.Internal.plugins).filter(
          (p) => p.bsUpdateAvailable
        ).length +
        Object.values(BetterStremio.Internal.themes).filter(
          (t) => t.bsUpdateAvailable
        ).length;

      if (updateCount > 0) {
        document
          .querySelector('[ui-sref="betterstremio"]')
          .insertAdjacentHTML(
            "beforeend",
            `<div id="bs-notification-count" style="position: absolute; top: -5px; right: -3px; background-color: #dd2232; color: white; height: 20px; border-radius: 50%; width: 20px; align-items: center; justify-content: center; font-weight: bold; line-height: 1; display: flex; font-size: 11px;">${
              updateCount > 9 ? "9+" : updateCount
            }</div>`
          );
      }
    },
  };

  const info = BetterStremio.Internal.reloadInfo();

  info.enabledPlugins.forEach((plugin) => {
    try {
      info.plugins[plugin].onBoot?.();
    } catch (e) {
      console.error(
        `[BetterStremio] Plugin '${plugin}' threw an exception at onBoot:`,
        e
      );
      BetterStremio.errors.push(["onBoot", e]);
    }
  });

  function itemButton() {
    const emptyImage =
      "data:image/webp;base64,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";

    return `<div tabindex="0" spatial-nav-enter="!plugin.bsBlock && toggle(name, plugin)" ng-repeat="(name, plugin) in type === 'plugins' ? plugins : themes" class="pure-u-1-4 addon ng-scope"><div class="addon-content"><div class="left-pane"><div class="addon-logo"><img alt="Logo" ng-src="{{plugin.getImage() || '${emptyImage}'}}"></div>
		  <div class="desc-row"><div class="heading"><h2 class="title">{{plugin.getName() || ""}}</h2>
		  <span class="version">v{{plugin.getVersion() || "0.0.0"}}</span></div>
		  <div class="addon-type">By: @{{plugin.getAuthor() || "unknown" }}</div>
		  <div class="description"><span class="ng-binding">{{plugin.getDescription() || ""}}</span></div></div></div><div class="right-pane">
		  <div class="buttons">
        <a ng-disabled="plugin.bsBlock" ng-hide="getExploring() === 'true'||!enabled(name)" ng-click="!plugin.bsBlock && disable(name)" class="install">Enabled</a>
        <a ng-disabled="plugin.bsBlock" ng-hide="getExploring() === 'true'||enabled(name)" ng-click="!plugin.bsBlock && enable(name)" class="remove">Disabled</a>
        <a ng-disabled="plugin.bsBlock" ng-hide="getExploring() !== 'true'||!installed(plugin)" ng-click="!plugin.bsBlock && uninstall(plugin)" class="install">Installed</a>
        <a ng-disabled="plugin.bsBlock" ng-hide="getExploring() !== 'true'||installed(plugin)" ng-click="!plugin.bsBlock && install(plugin)" class="remove">Install</a>
        <a tabindex="0" ng-hide="getExploring() === 'true'||!plugin.onSettings" ng-class="!enabled(name) && 'remove'" ng-click="settings(name)" ng-title="translate('ADDON_CONFIGURE')" class="configure small" style="margin-right:0;margin-left:.75rem;"><svg icon="settings" class="icon" viewBox="0 0 512 512"></svg></a>
        <a ng-disabled="plugin.bsBlock" tabindex="0" ng-hide="getExploring() === 'true'" ng-click="!plugin.bsBlock && uninstall(name)" class="configure small configure-uninstall" style="margin-right:0;margin-left:.75rem;"><svg icon="close" class="icon" viewBox="0 0 512 512"></svg></a>
		  </div>
		  <div ng-hide="!plugin.getShareURL()" ng-click="share(name)" class="share"><svg icon="share" class="icon" viewBox="0 0 512 512"></svg>Share {{type === "plugins" ? "Plugin" : "Theme"}}</div>
		  <div ng-hide="!plugin.bsUpdateAvailable" ng-click="update(name)" tabindex="-1" class="share bs-update"><svg viewBox="0 0 256 256" class="icon"><g fill="#ffffff"><g transform="scale(8,8)"><path d="M16,4c-6.61719,0 -12,5.38281 -12,12h2c0,-5.51562 4.48438,-10 10,-10c3.69531,0 6.92578,2.01172 8.65625,5h-3.65625v2h7v-7h-2v3.40625c-2.14453,-3.25391 -5.82031,-5.40625 -10,-5.40625zM26,16c0,5.51563 -4.48437,10 -10,10c-3.69531,0 -6.92578,-2.01172 -8.65625,-5h3.65625v-2h-7v7h2v-3.40625c2.14453,3.25391 5.82031,5.40625 10,5.40625c6.61719,0 12,-5.38281 12,-12z"></path></g></g></svg>Update Available</div>
		  </div></div></div>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const bsStyle = document.createElement("style");
    document.head.appendChild(bsStyle);
    bsStyle.appendChild(
      document.createTextNode(
        `.popup-title { white-space: normal !important; } #controlbar .control.active .popup { display: none } #controlbar .control.bs-active .popup { display: -webkit-box; display: -moz-box; display: -webkit-flex; display: -ms-flexbox; display: box; display: flex }`
      )
    );

    info.enabledThemes.forEach((theme) =>
      BetterStremio.Themes.enable(theme, false)
    );

    BetterStremio.createTemplate(
      "betterStremioTpl",
      `<div ng-controller="betterStremioCtrl" ng-cloak><div id="addonsCatalog"><div id="addons"><div id="betterstremio-filters" spatial-nav-section="{ id: 'betterstremio-filters', enterTo: 'last-focused'}" spatial-nav-section-active="$state.includes('betterstremio') &amp;&amp; ! prompt" class="options"><div class="filters"><ul class="segments"><li ng-repeat="type in ['plugins', 'themes']" ui-sref="betterstremio({ type: type })" ui-sref-opts="{location: 'replace'}" ng-class="{ selected: type == getSelectedType() }" autofocus="type == getSelectedType()" tabindex="-1"><span ng-if="type == 'plugins'" translate="Plugins" class="label"> </span><span ng-if="type == 'themes'" translate="Themes" class="label"></span></li></ul></div><div class="filters"><span id="betterstremio-version" style="margin-top: 0.5rem;margin-right: 10px;align-items: center;display: flex;color: gray;font-size: 10px;flex-wrap: nowrap;flex-direction: column;">BetterStremio v${
        BetterStremio.version
      }<span ng-click="openChangelog()" tabindex="-1" style="cursor: pointer; color: palegoldenrod;">(changelog)</span></span><ul class="segments"><li ng-click="reloadAll()" tabindex="-1"><span class="label">Reload</span></li><li ng-click="toggleExploring()" tabindex="-1"><span class="label">{{getExploring() === "true" ? "My " + (getSelectedType() === "plugins" ? "Plugins" : "Themes") : "Explore"}}</span></li><li ng-click="openFolder()" tabindex="-1"><span class="label">Open folder</span></li></ul></div></div>
      <span ng-hide="getExploring() !== 'true'" style="padding:2rem;"><strong style="color: red;">Warning:</strong> You are about to install community/third-party plugins and themes. These are not verified and <strong>may inject malicious code</strong>, steal your account or compromise your privacy and security.Only install plugins and themes from sources you trust.</span>
      <div class="segments" ng-hide="getExploring() !== 'true'" style="display: flex;flex-wrap: wrap;justify-content: center;align-items: center;">
        <li ng-click="setSort('stars', 'desc')" tabindex="-1" style="margin: 0 0.5rem; padding: 0.5rem 1rem; border: 1px solid gray; border-radius: 25px; cursor: pointer;" ng-class="{ selected: isSorting('stars', 'desc') }">Sort by stars (desc)</li>
        <li ng-click="setSort('stars', 'asc')" tabindex="-1" style="margin: 0 0.5rem; padding: 0.5rem 1rem; border: 1px solid gray; border-radius: 25px; cursor: pointer;" ng-class="{ selected: isSorting('stars', 'asc') }">Sort by stars (asc)</li>
        <li ng-click="setSort('updated', 'desc')" tabindex="-1" style="margin: 0 0.5rem; padding: 0.5rem 1rem; border: 1px solid gray; border-radius: 25px; cursor: pointer;" ng-class="{ selected: isSorting('updated', 'desc') }">Sort by updated (desc)</li>
        <li ng-click="setSort('updated', 'asc')" tabindex="-1" style="margin: 0 0.5rem; padding: 0.5rem 1rem; border: 1px solid gray; border-radius: 25px; cursor: pointer;" ng-class="{ selected: isSorting('updated', 'asc') }">Sort by updated (asc)</li>
      </div>
      <div ng-hide="!loading" style="margin-top:5rem;display: flex;justify-content: center;align-items: center;"><span class="bs-plugins-loader"></span></div>
      <div ng-repeat="type in ['plugins', 'themes']" ng-hide="type != getSelectedType()" class="content">${itemButton()}</div></div></div></div>
      <style type="text/css">.addon-content .right-pane{flex-wrap: wrap;justify-content: center;align-items: center;display: flex;}.addon-content .right-pane .buttons {min-width:100%;}@keyframes shine { 0% { left: -100%; } 50% { left: 50%; } 100% { left: 200%; } } .bs-update { position: relative; overflow: hidden; background: cornflowerblue; border-radius: 3rem; width: 100%; } .bs-update::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient( 120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100% ); transform: skewX(-45deg); transition: none; pointer-events: none; } .bs-update::after { animation: shine 2s linear infinite; } .bs-plugins-loader{width: 48px;height: 48px;border: 3px solid #FFF;border-radius: 50%;display: inline-block;position: relative;box-sizing: border-box;animation: rotation 1s linear infinite;}.bs-plugins-loader::after {content: '';box-sizing: border-box;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);width: 56px;height: 56px;border-radius: 50%;border: 3px solid;border-color: #7b5bf5 transparent;}@keyframes rotation {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}.addon-content .title, .addon-content .addon-type { white-space: nowrap; text-overflow: ellipsis; max-width: calc(50vw - 20rem); overflow: hidden; } .addon-content .version { white-space: nowrap; text-overflow: ellipsis; max-width: calc(50vw - 20rem); overflow: hidden; } .addon-content .description { display: -webkit-box; -webkit-line-clamp: 10; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }.addon .buttons .configure-uninstall { display: none; background-color: #DF2A2A; } .addon .buttons .configure-uninstall:hover { background-color: transparent; -webkit-box-shadow: 0 0 0 .17rem #DF2A2A !important; box-shadow: 0 0 0 .17rem #DF2A2A !important; }.buttons a[disabled] { opacity: 0.4; pointer-events: none; }</style>`
    );

    stremioApp.run([
      "$rootScope",
      "toasts",
      "player",
      "sharing",
      function (root, toasts, player, sharing) {
        BetterStremio.StremioRoot = root;
        BetterStremio.StremioRoot.tabs.splice(5, 0, {
          id: 6,
          name: "BetterStremio",
          icon: "betterstremio",
          route: "betterstremio",
        });
        BetterStremio.Toasts = toasts;
        BetterStremio.Player = player;
        BetterStremio.Sharing = sharing;
      },
    ]);

    stremioApp.config([
      "$stateProvider",
      function (t) {
        t.state({
          name: "betterstremio",
          url: "/betterstremio/:type?explore",
          params: {
            type: "plugins",
            explore: "false",
          },
          views: {
            view: {
              templateUrl: "betterStremioTpl",
            },
          },
        });
      },
    ]);

    stremioApp.controller("betterStremioCtrl", [
      "$scope",
      "$state",
      "sharing",
      function (s, m, d) {
        s.sortKey = "stars";
        s.sortOrder = "desc";
        s.page = 1;
        const context = () =>
          m.params.type === "plugins"
            ? BetterStremio.Plugins
            : BetterStremio.Themes;
        const enabledValues = () =>
          m.params.type === "plugins"
            ? BetterStremio.Internal.enabledPlugins
            : BetterStremio.Internal.enabledThemes;
        const entries = () =>
          m.params.type === "plugins"
            ? BetterStremio.Internal.plugins
            : BetterStremio.Internal.themes;

        s.getSelectedType = () => m.params.type;
        s.getExploring = () => m.params.explore;
        s.getCatalogs = () => ["plugins", "themes"];
        s.reloadAll = () => context().reload();
        s.enable = (name) => context().enable(name);
        s.disable = (name) => context().disable(name);
        s.toggle = (name, plugin) => {
          if (m.params.explore === "true") {
            return s.installed(plugin)
              ? s.uninstall(plugin)
              : s.install(plugin);
          } else {
            return enabledValues().includes(name)
              ? context().disable(name)
              : context().enable(name);
          }
        };
        s.settings = (name) => entries()[name].onSettings();
        s.enabled = (name) => enabledValues().includes(name);
        s.installed = (plugin) =>
          enabledValues().includes(path.basename(plugin.download_url));
        s.install = (plugin) => {
          const pluginFile = path.basename(plugin.download_url);
          const pluginPath = `${m.params.type}/${pluginFile}`;
          BetterStremio.Internal.update(pluginPath, plugin.download_url);
          BetterStremio.Internal.reloadInfo();
          if (m.params.type === "plugins") {
            BetterStremio.Plugins.reload();
            BetterStremio.Plugins.enable(pluginFile);
          } else {
            BetterStremio.Themes.reload();
            BetterStremio.Themes.enable(pluginFile);
          }
        };
        s.uninstall = (plugin) => {
          const pluginFile = path.basename(plugin.download_url || plugin);
          const pluginPath = `${m.params.type}/${pluginFile}`;
          BetterStremio.Internal.delete(pluginPath);
          if (m.params.type === "plugins") {
            BetterStremio.Plugins.disable(pluginFile);
            BetterStremio.Internal.reloadInfo();
            BetterStremio.Plugins.reload();
          } else {
            BetterStremio.Themes.disable(pluginFile);
            BetterStremio.Internal.reloadInfo();
            BetterStremio.Themes.reload();
          }
        };
        s.openFolder = () => BetterStremio.Internal.fetch("/folder", false);
        s.setSort = (key, order) => {
          s.page = 1;
          s.sortKey = key;
          s.sortOrder = order;
          s.refreshItems();
        };
        s.installablesCache = window.BetterStremio.Internal.installablesCache;
        s.getInstallables = async () => {
          const type = m.params.type.substring(0, m.params.type.length - 1);
          const searchUrl = `https://api.github.com/search/repositories?q=topic:betterstremio+topic:${type}&sort=${s.sortKey}&order=${s.sortOrder}&per_page=12&page=${s.page}`;
          let items = null;
          let installables = [];
          const cacheKey =
            type + s.page + s.sortKey + s.sortOrder + new Date().getMinutes();
          if (s.installablesCache[cacheKey]) {
            return s.installablesCache[cacheKey];
          }
          try {
            const request = await fetch(searchUrl, {
              body: null,
              method: "GET",
            });
            const response = await request.json();
            items = response.items;
          } catch (e) {
            console.error("[BetterStremio] Error exploring installables", e);
          }

          if (!items) {
            s.installablesCache[cacheKey] = installables;
            return installables;
          }
          for (const item of items) {
            try {
              const latestReleaseUrl = `https://api.github.com/repos/${item.full_name}/contents`;
              const releaseRequest = await fetch(latestReleaseUrl, {
                body: null,
                method: "GET",
              });
              const fileContents = await releaseRequest.json();
              const asset = fileContents.find((el) =>
                type === "plugin"
                  ? el.name.endsWith(".plugin.js")
                  : el.name.endsWith(".theme.css")
              );
              item.installable = true;
              item.fileContents = fileContents;
              item.asset = asset;
              if (!asset) continue;
              const url = asset.download_url;
              const sandboxed =
                type === "plugin"
                  ? await sandboxedPlugin(url)
                  : await sandboxedTheme(url);
              if (!sandboxed) continue;
              sandboxed.installable = true;
              sandboxed.download_url = url;
              installables.push(sandboxed);
            } catch (e) {
              console.error(
                `[BetterStremio] Error fetching installable "${item.full_name}":`,
                e
              );
            }
          }

          s.installablesCache[cacheKey] = installables;
          return installables;
        };
        s.themes = [];
        s.plugins = [];
        s.refreshItems = async () => {
          s.themes = [];
          s.plugins = [];
          s.loading = true;
          m.params.type === "plugins"
            ? (s.plugins =
                m.params.explore !== "true"
                  ? BetterStremio.Internal.plugins
                  : await s.getInstallables())
            : (s.themes =
                m.params.explore !== "true"
                  ? BetterStremio.Internal.themes
                  : await s.getInstallables());
          s.loading = false;
          if (!s.$$phase) s.$digest();
        };
        s.refreshItems();
        s.isSorting = (key, order) =>
          s.sortKey === key && s.sortOrder === order;
        s.toggleExploring = () => {
          s.page = 1;
          s.sortKey = "stars";
          s.sortOrder = "desc";
          s.themes = [];
          s.plugins = [];
          m.go("betterstremio", {
            explore: m.params.explore !== "true" ? "true" : "false",
          });
          s.refreshItems();
        };
        s.openChangelog = () => {
          const noCache = "v=" + Date.now();
          BetterStremio.Internal.fetch(`/changelog?${noCache}`, false);
        };
        s.update = async (name) => {
          const isEnabled = enabledValues().includes(name);
          if (isEnabled) context().disable(name);
          const updateURL = entries()[name].getUpdateURL();
          if (!updateURL) return;
          await BetterStremio.Internal.update(
            `${m.params.type}/${name}`,
            updateURL
          );
          BetterStremio.Internal.reloadInfo();
          if (isEnabled) context().enable(name);
          await checkPluginUpdates();
          await checkThemeUpdates();
          BetterStremio.Internal.refreshCtrl();
          BetterStremio.Toasts.info(
            `Updated ${
              m.params.type === "plugins" ? "Plugin" : "Theme"
            } "${entries()[name].getName()}" to v${entries()[
              name
            ]?.getVersion?.()}`
          );
          s.refreshItems();
        };
        s.share = (name) => {
          d.sendShare({
            url:
              entries()[name].getShareURL() || entries()[name].getUpdateURL(),
            name: entries()[name].getName(),
            type: "copylink",
          });
        };
      },
    ]);

    BetterStremio.monkeyPatch("icon", (module) => {
      const originalFn = module.link;
      module.link = function (c, o) {
        if (Object.keys(BetterStremio.Icons).includes(arguments[2].icon)) {
          c.$watch(
            () => o.attr("icon"),
            (c) => {
              var r = BetterStremio.Icons[c];
              if (r) {
                var e = document.createElement("svg");
                r.paths.forEach(function (l) {
                  var c = document.createElement("path");
                  c.setAttribute("d", l.d),
                    c.setAttribute("style", l.style),
                    e.appendChild(c);
                }),
                  (o.context.innerHTML = e.innerHTML),
                  o.context.setAttribute("viewBox", r.viewBox);
              }
            }
          );
        } else originalFn.apply(originalFn, arguments);
      };
      return module;
    });

    stremioApp._invokeQueue.forEach((queueItem, queueIdx) => {
      const [k, v] = queueItem[2];

      if (queueItem[1] === "directive") BetterStremio.Directives[k] = v;
      else if (queueItem[1] === "factory") BetterStremio.Factories[k] = v;
      else if (queueItem[1] === "register") BetterStremio.Registry[k] = v;
      else if (queueItem[1] === "decorator") BetterStremio.Decorators[k] = v;
      else if (queueItem[1] === "service") BetterStremio.Services[k] = v;

      if (typeof v !== "object") {
        const queue = stremioApp._invokeQueue[queueIdx];
        if (typeof v !== "function") return;
        const originalFn = v;
        queue[2][1] = function () {
          const returned = originalFn.apply(originalFn, arguments);
          BetterStremio.Internal.events.onInvoke.forEach(({ ctrl, fn }) =>
            ctrl === k ? fn(returned) : 0
          );
          BetterStremio.Directives[k] = returned;
          return returned;
        };
        return;
      }
      const scopeIdx = v.indexOf("$scope");
      const queue = stremioApp._invokeQueue[queueIdx];
      const originalCallers = queue[queue.length - 1][1];
      const originalFn = queue[queue.length - 1][1][originalCallers.length - 1];
      queue[queue.length - 1][1][originalCallers.length - 1] = function () {
        v.forEach((mod) => {
          if (
            typeof mod === "string" &&
            !["$scope", "$rootScope"].includes(mod)
          ) {
            BetterStremio.Modules[mod] = arguments[v.indexOf(mod)];
          }
        });
        if (scopeIdx > -1) {
          BetterStremio.Scopes[k] = arguments[scopeIdx];
          if (BetterStremio.Internal.events.onInvoke)
            BetterStremio.Internal.events.onInvoke.forEach(({ ctrl, fn }) =>
              ctrl === k ? fn(arguments[scopeIdx]) : 0
            );
        }
        const returned = originalFn.apply(originalFn, arguments);
        if (scopeIdx === -1) {
          BetterStremio.Modules[k] = returned;
          if (BetterStremio.Internal.events.onInvoke)
            BetterStremio.Internal.events.onInvoke.forEach(({ ctrl, fn }) =>
              ctrl === k ? fn(returned) : 0
            );
        }
        return returned;
      };
    });

    const boardTpl = document.querySelector("#boardTpl");
    boardTpl.innerHTML = boardTpl.innerHTML.replace(
      'stremio-image="::{ url: notif.background }"',
      `stremio-image="::{ url: notif.background.replace('background', 'poster') }"`
    );

    // Patch 1: Fix player not playing/pausing on clicking the <video> element
    const playerTpl = document.querySelector("#playerTpl");
    playerTpl.innerHTML = playerTpl.innerHTML
      .replace(
        /(id\s*=\s*"videoPlayer")/g,
        `$1 ng-click="player.paused = !player.paused"`
      )
      .replace(
        /(class\s*=\s*"subtitles-container\b)/g,
        `ng-click="player.paused = !player.paused" $1`
      );

    // Patch 2: Fix all popups (auto closing when not mouse isn't moving inside them for < 1s)
    let index = 0;
    playerTpl.innerHTML = playerTpl.innerHTML.replace(
      /(class\s*=\s*"control\b)/g,
      (_match, classAttr) => {
        const ctrlIndex = index++;
        return `ng-mouseenter="bsMouseEnter(${ctrlIndex})"
                  ng-focus="bsMouseEnter(${ctrlIndex})"
                  ng-blur="bsMouseLeave()"
                  ng-mouseleave="bsMouseLeave()"
                  ng-class="{'bs-active': bsActiveIndex===${ctrlIndex}}" ${classAttr}`;
      }
    );

    window.BetterStremio.monkeyPatch("playerCtrl", (ctrl) => {
      ctrl.bsMouseEnter = (idx) => {
        clearTimeout(ctrl.leaveTimeout);
        ctrl.bsActiveIndex = idx;
        window.BetterStremio.Scopes.playerCtrl.$evalAsync();
      };
      ctrl.bsMouseLeave = () => {
        if (ctrl.leaveTimeout) clearTimeout(ctrl.leaveTimeout);
        ctrl.leaveTimeout = setTimeout(() => {
          ctrl.bsActiveIndex = -1;
          window.BetterStremio.Scopes.playerCtrl.$evalAsync();
        }, 200);
        setTimeout(() => {
          if (document.activeElement.matches(".control .popup *"))
            clearTimeout(ctrl.leaveTimeout);
        }, 1);
      };
    });

    info.enabledPlugins.forEach((plugin) => {
      try {
        info.plugins[plugin].onReady?.();
        const safeName = plugin.replace(/[^a-z0-9 _\.]/gi, "");
        document
          .querySelector(`.bs-internal-styles[data-plugin="${safeName}"]`)
          ?.remove();
        const internalTheme = info.plugins[plugin]?.styles;
        if (internalTheme) {
          const style = `<style type="text/css" data-plugin="${safeName}" class="bs-internal-styles">${internalTheme}</style>`;
          document.body.insertAdjacentHTML("afterbegin", style);
        }
      } catch (e) {
        console.error(
          `[BetterStremio] Plugin '${plugin}' threw an exception at onReady:`,
          e
        );
        BetterStremio.errors.push(["onReady", e]);
      }
    });
  });

  async function checkForUpdates() {
    const updateURL =
      "https://raw.githubusercontent.com/MateusAquino/BetterStremio/refs/heads/dev/BetterStremio.loader.js";

    const noCache = "v=" + Date.now();
    const updateURLNoCache = updateURL.includes("?")
      ? updateURL + "&" + noCache
      : updateURL + "?" + noCache;

    fetch(updateURLNoCache, {
      body: null,
      method: "GET",
    })
      .then(async (res) => {
        const loader = await res.text();
        const match = /BetterStremio\.version\s*=\s*"(.*?)"/gm.exec(loader);
        if (match && match[1] && match[1] !== BetterStremio.version) {
          await BetterStremio.Internal.update(
            "BetterStremio.loader.js",
            updateURL
          );
          BetterStremio.Toasts.info(
            "BetterStremio update available!",
            `Close Stremio from system tray and reopen to upgrade to v${match[1]}.`
          );
        } else if (match && match[1]) {
          console.log(`[BetterStremio] Running latest version. (v${match[1]})`);
        } else {
          console.error(
            `[BetterStremio] Couldn't fetch version from loader content:`,
            loader
          );
        }
      })
      .catch((e) => {
        console.error("[BetterStremio] Failed to check for updates", e);
      });

    await checkPluginUpdates();
    await checkThemeUpdates();
    BetterStremio.Internal.refreshCtrl();
  }

  async function checkPluginUpdates() {
    for (const [pluginName, plugin] of Object.entries(
      BetterStremio.Internal.plugins
    )) {
      try {
        const updateURL = plugin.getUpdateURL();
        if (!updateURL) continue;
        const noCache = "v=" + Date.now();
        const updateURLNoCache = updateURL.includes("?")
          ? updateURL + "&" + noCache
          : updateURL + "?" + noCache;

        const newPlugin = await sandboxedPlugin(updateURLNoCache, updateURL);
        if (!newPlugin) continue;
        if (
          newPlugin?.getVersion?.() &&
          newPlugin.getVersion() !== plugin?.getVersion?.()
        ) {
          console.log(
            'Update for plugin "' + pluginName + '" available:',
            plugin.getVersion(),
            "~>",
            newPlugin.getVersion()
          );
          plugin.bsUpdateAvailable = true;
        }
      } catch (e) {
        console.error(
          `[BetterStremio] Plugin '${pluginName}' threw an exception at update check:`,
          e
        );
        BetterStremio.errors.push(["updateCheck", e]);
      }
    }
  }

  async function checkThemeUpdates() {
    for (const theme of Object.values(BetterStremio.Internal.themes)) {
      try {
        const updateURL = theme.getUpdateURL();
        if (!updateURL) continue;
        const noCache = "v=" + Date.now();
        const updateURLNoCache = updateURL.includes("?")
          ? updateURL + "&" + noCache
          : updateURL + "?" + noCache;
        const newTheme = sandboxedTheme(updateURLNoCache);
        if (!newTheme) continue;
        if (
          newTheme?.getVersion?.() &&
          newTheme.getVersion() !== theme.getVersion()
        ) {
          console.log(
            'Update for theme "' + theme.name + '" available:',
            theme.getVersion(),
            "~>",
            newTheme.getVersion()
          );
          theme.bsUpdateAvailable = true;
        }
      } catch (e) {
        console.error(
          `[BetterStremio] Theme '${theme.name}' threw an exception at update check:`,
          e
        );
        BetterStremio.errors.push(["updateCheck", e]);
      }
    }
  }

  async function sandboxedPlugin(url, updateURL = "") {
    const res = await fetch(url, { body: null, method: "GET" });
    const consts = [
      "window",
      "document",
      "console",
      "module",
      "exports",
      "eval",
      "Function",
      "Object",
      "Array",
    ];
    const pluginSource = await res.text();
    if (!pluginSource) return;

    const methods = Object.getOwnPropertyNames(window).filter(
      (m) => typeof window[m] === "function" || typeof window[m] === "object"
    );
    const PluginModule = new Function(
      `"use strict";
       arguments[0].Object.defineProperty(arguments[0].Object.prototype, 'constructor', { value: undefined });
       arguments[0].Object.defineProperty(arguments[0].Array.prototype, 'constructor', { value: undefined });
       arguments[0].Object.defineProperty(arguments[0].Function.prototype, 'constructor', { value: undefined });
       
       ${methods
         .filter((m) => !m.includes("-") && !consts.includes(m))
         .map((m) => `const ${m} = undefined;`)
         .join("\n")}
       
       const console = undefined;
       const document = undefined;
       const window = undefined;
       const Function = undefined;
       const Object = undefined;
       const Array = undefined;
       arguments[0] = undefined;
       
       return (function() {
         "use strict";
         return function() {
           "use strict";
           let module = { exports: {} };
           let exports = module.exports;
           return (function() {
             return ${pluginSource
               .replace(/\bwhile\s*\([^)()]*?\)/, ";")
               .replace(/\bfor\s*\([^)(]*?\)/, ";")}\n//# sourceURL=${updateURL}
           }).call(this);
         };
       })`
    )(window);
    return new (PluginModule()())();
  }

  async function sandboxedTheme(url) {
    const res = await fetch(url, { body: null, method: "GET" });
    const loader = await res.text();
    if (!loader) return;
    return parseTheme(loader);
  }

  window.onload = () => {
    setTimeout(() => checkForUpdates(), 2000);
    setInterval(() => checkForUpdates(), 86400000);

    info.enabledPlugins.forEach((plugin) => {
      try {
        info.plugins[plugin].onLoad?.();
      } catch (e) {
        console.error(
          `[BetterStremio] Plugin '${plugin}' threw an exception at onLoad:`,
          e
        );
        BetterStremio.errors.push(["onLoad", e]);
      }
    });
  };
})();
