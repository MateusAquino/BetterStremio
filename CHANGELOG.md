# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2024-01-05

### Added

- Fixed cached responses.
- Fixed notification icon.

## [1.0.4] - 2024-01-05

### Added

- New notification icon couting plugins/themes available to update.

## [1.0.3] - 2024-01-03

### Added

- Autoupdate: automatically check for updates on plugins & themes.
- Improved plugins error handling.
- Reduced final binary size (moved assets to the web).
- Fixed BetterStremio UI / reloading for plugins and themes (`BetterStremio.Internal.reloadUI`).
- Fixed installer compatibility with Windows systems of users suffering from [USERPROFILE abbreviation](https://superuser.com/questions/892228/user1-in-user-folder).
- Added new status messages to installer (to monitor the patching/unpatching process).


## [1.0.2] - 2024-12-29

### Added

- Windows / Linux compatibility (requires repatching).
- New open changelog route.

### Removed

-  Windows batch installer: replaced by a universal WebUI installer.


## [1.0.1] - 2024-06-05

### Added

- BetterStremio.Modules.
- BetterStremio.Scopes.


## [1.0.0] - 2024-06-02

### Added

- Patching script (Windows).
- BetterStremio Loader (plugins & themes).
- Documentation: CHANGELOG and README.
- Autoupdate for BetterStremio Loader.

[1.0.0]: https://github.com/MateusAquino/BetterStremio/releases/tag/v1.0.0
[1.0.1]: https://github.com/MateusAquino/BetterStremio/releases/tag/v1.0.1
[1.0.2]: https://github.com/MateusAquino/BetterStremio/releases/tag/v1.0.2
