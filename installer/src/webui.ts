if (import.meta.env.MODE === "development") {
  globalThis.getPath = () => "Path Mockup";
  globalThis.validatePath = (e) => (e !== "Path Mockup" ? "true" : "false");
  globalThis.install = (_path, installWp, installAmoled) =>
    globalThis.asyncResult({
      result: installWp || installAmoled ? true : "Error on install",
      type: "install",
    });
  globalThis.uninstall = (_path) =>
    globalThis.asyncResult({ result: true, type: "uninstall" });
  globalThis.webui = {
    event: { CONNECTED: "connected" },
    setEventCallback: (callback) => callback(globalThis.webui.event.CONNECTED),
  };
}

globalThis.setStatus = (_status) => {
  console.error("Set Status (setStatus/1) called before definition");
};

globalThis.asyncResult = (_result) => {
  console.error("Async Result (asyncResult/1) called before definition");
};
