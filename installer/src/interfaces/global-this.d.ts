// deno-lint-ignore-file no-var
export {};

declare global {
  var getPath: () => string;
  var validatePath: (path: string) => string;
  var install: (
    path: string,
    installWp: boolean,
    installAmoled: boolean,
  ) => void;
  var uninstall: (path: string) => void;
  var webui: {
    event: { CONNECTED: string };
    setEventCallback: (callback: (event: string) => void) => void;
  };
  var asyncResult: (result: { result: true | string; type: string }) => void;
  var setStatus: (status: string) => void;
}
