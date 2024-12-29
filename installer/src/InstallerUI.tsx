import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Clapperboard,
  ExternalLink,
  Download,
  Trash2,
  X,
  CircleHelp,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.tsx";

export default function InstallerUI() {
  const [isValidPath, setIsValidPath] = useState<boolean>(false);
  const [path, setPath] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<React.ReactNode | null>(null);
  const [children, setChildren] = useState<React.ReactNode | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [extraWatchParty, setExtraWatchParty] = useState(false);
  const [extraAmoled, setExtraAmoled] = useState(false);

  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextmenu);
    globalThis.webui.setEventCallback(
      (e) => e == globalThis.webui.event.CONNECTED && setConnected(true)
    );
    return () => document.removeEventListener("contextmenu", handleContextmenu);
  }, []);

  useEffect(() => {
    if (connected)
      (async () => {
        setPath(await globalThis.getPath());
        globalThis.asyncResult = (result) => {
          setStatus(null);
          setInstalling(false);
          if (result.result === true) {
            setTitle("Success");
            setDescription(
              <span className="text-green-400">
                {result.type === "install"
                  ? "Installation/reparation successful!"
                  : "Uninstallation successful!"}
              </span>
            );
            setChildren(
              <div className="grid gap-4">
                <span className="text-gray-400">
                  Stremio was successfuly{" "}
                  {result.type === "install" ? "patched" : "unpatched"}. If you
                  have any issues, please report them on{" "}
                  <a
                    href="https://github.com/MateusAquino/BetterStremio/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300"
                  >
                    GitHub
                  </a>
                  .
                  {result.type === "uninstall" && (
                    <>
                      <br />
                      <br />
                      Note: your plugins, themes and settings have remained
                      untouched.
                    </>
                  )}
                </span>
              </div>
            );
            setDialogOpen(true);
          } else {
            setTitle("Error");
            setDescription(
              <span className="text-red-400">
                {result.type === "install"
                  ? "Error on installation/reparation"
                  : "Error on uninstallation"}
              </span>
            );
            setChildren(
              <div className="grid gap-4">
                <span className="text-gray-400">
                  An error occurred while{" "}
                  {result.type === "install"
                    ? "installing/reparing"
                    : "uninstalling"}{" "}
                  BetterStremio: <br />
                  <br />
                  <pre>
                    <code>{result.result}</code>
                  </pre>
                  <br />
                  If you are unable to resolve the issue, please seek help on{" "}
                  <a
                    href="https://github.com/MateusAquino/BetterStremio/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300"
                  >
                    GitHub
                  </a>
                  .
                </span>
              </div>
            );
            setDialogOpen(true);
          }
        };
      })();
  }, [connected]);

  useEffect(() => {
    if (connected)
      (async () => {
        const validPath = await globalThis.validatePath(path);
        setIsValidPath(validPath === "true");
      })();
  }, [path]);

  const handleInstall = () => {
    setInstalling(true);
    setStatus("Patching Stremio...");
    globalThis.install(path, extraWatchParty, extraAmoled);
  };

  const handleUninstall = () => {
    setInstalling(true);
    setStatus("Unpatching Stremio...");
    globalThis.uninstall(path);
  };

  const handleExit = () => {
    setStatus("Exiting...");
    globalThis.close();
  };

  return (
    (connected && (
      <div className="h-screen flex flex-col">
        <div
          className={
            "flex bg-gray-900 text-gray-100 p-8 " +
            (status ? "h-[calc(100%-57px)]" : "h-full")
          }
        >
          <div className="w-2/3 pr-8 border-r border-gray-700 overflow-y-auto scroll-smooth">
            {/* Logo Section */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="flex items-center space-x-4">
                      <img
                        src="/android-chrome-192x192.png"
                        width={90}
                        height={90}
                        alt="BetterStremio Logo"
                        className="rounded-xl p-2"
                      />
                      <h1 className="text-4xl md:text-6xl font-normal text-center bg-gradient-to-r from-purple-300 to-purple-500 text-transparent bg-clip-text">
                        Better<span className="font-black">Stremio</span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Description */}
              <div className="flex items-center gap-2 text-lg text-zinc-300 w-100 justify-center">
                <Clapperboard className="w-6 h-6 text-purple-300" />
                <a
                  className="text-purple-300 hover:underline font-medium"
                  href="https://github.com/MateusAquino/BetterStremio"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="BetterStremio GitHub Repository"
                >
                  BetterStremio
                </a>{" "}
                is a dynamic Plugin & Theme loader for Stremio.
              </div>

              {/* How it works section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  <h2 className="text-2xl font-bold text-zinc-100">
                    How it works
                  </h2>
                </div>

                <div className="rounded-lg text-zinc-300 leading-relaxed">
                  <p>
                    BetterStremio patches the{" "}
                    <code className="bg-zinc-800 px-2 py-1 rounded text-purple-400">
                      server.js
                    </code>{" "}
                    file to inject code (plugins and themes) in the local
                    development web server hosted at{" "}
                    <code className="bg-zinc-800 px-2 py-1 rounded text-purple-400">
                      127.0.0.1:11470
                    </code>{" "}
                    and adds a loader script to run external plugins and CSS
                    themes. There is no need to download external custom Stremio
                    executables! :)
                  </p>
                </div>
              </div>
            </div>

            {/* Resources section */}
            <h2 className="font-semibold mt-5 mb-6 text-2xl text-purple-300">
              Resources
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  title: "Explore",
                  url: "https://github.com/topics/betterstremio",
                  description:
                    "Search for plugins and themes in the BetterStremio GitHub Topics",
                },
                {
                  title: "Documentation",
                  url: "https://github.com/MateusAquino/BetterStremio/blob/main/README.md#-developing-plugins--themes",
                  description:
                    "Guides and references for Plugins and Themes developers",
                },
                {
                  title: "GitHub Repository",
                  url: "https://github.com/MateusAquino/BetterStremio",
                  description:
                    "Access or contribute to the BetterStremio source code and installer",
                },
                {
                  title: "Support",
                  url: "https://github.com/MateusAquino/BetterStremio/issues",
                  description:
                    "Get help from our community, report issues or request features",
                },
                {
                  title: "Installer Releases",
                  url: "https://github.com/MateusAquino/BetterStremio/releases",
                  description:
                    "Once installed, BetterStremio is auto-updated to the latest version, but you can still view all previous installer releases here",
                },
                {
                  title: "Changelog",
                  url: "https://github.com/MateusAquino/BetterStremio/blob/main/CHANGELOG.md",
                  description:
                    "See what's new in the latest BetterStremio version",
                },
              ].map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center">
                    {resource.title}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </h3>
                  <p className="text-gray-400">{resource.description}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-1/3 pl-8 justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <h1 className="text-3xl font-normal bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-500">
                  Installer
                </h1>
              </div>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed border-b border-gray-700 pb-8">
                Thank you for downloading! Use this tool to install, repair or
                uninstall BetterStremio. You can also change the options below
                to customize your installation.
              </p>
              <div className="flex space-y-2 flex-col">
                <div className="grid w-full items-center gap-1.5 mb-1">
                  <Label
                    htmlFor="path"
                    className="text-sm font-bold flex items-center gap-1.5"
                  >
                    Path{" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CircleHelp className="w-4 h-4 text-purple-300" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            <b>Stremio installation path</b>
                            <br />
                            Folder containing the Stremio executable and its
                            files.
                            <br />
                            <br />
                            default (win):{" "}
                            <code>%localAppData%\Programs\LNV\Stremio-4\</code>
                            <br />
                            default (unix): <code>/opt/stremio/</code>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    type="path"
                    id="path"
                    value={path}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPath(e.target.value)
                    }
                    placeholder="Stremio installation path"
                    className="bg-gray-800 border-gray-600 w-full"
                  />
                  {isValidPath || (
                    <span className="text-sm text-red-400">
                      Must point to a valid Stremio installation path
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extra-watchparty"
                    className="bg-gray-800 border-gray-600"
                    checked={extraWatchParty}
                    onCheckedChange={() => setExtraWatchParty(!extraWatchParty)}
                  />
                  <label
                    htmlFor="extra-watchparty"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Install{" "}
                    <a
                      className="text-purple-300"
                      href="https://github.com/MateusAquino/WatchParty"
                      target="_blank"
                    >
                      WatchParty
                    </a>{" "}
                    plugin
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extra-amoled"
                    className="bg-gray-800 border-gray-600"
                    checked={extraAmoled}
                    onCheckedChange={() => setExtraAmoled(!extraAmoled)}
                  />
                  <label
                    htmlFor="extra-amoled"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Install{" "}
                    <a
                      className="text-purple-300"
                      href="https://github.com/REVENGE977/StremioAmoledTheme"
                      target="_blank"
                    >
                      Amoled
                    </a>{" "}
                    (pitch black) theme
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-x-4 flex">
                <Button
                  className="bg-purple-400 hover:bg-purple-500 transition-colors text-gray-900 py-6 text-lg flex items-center justify-center flex-1"
                  onClick={handleInstall}
                  disabled={installing || !isValidPath}
                >
                  <Download className="w-5 h-5" />
                  <span>Install / Repair</span>
                </Button>
                <Button
                  className="bg-red-400 hover:bg-red-500 transition-colors text-gray-900 py-6 text-lg flex items-center justify-center flex-1"
                  onClick={handleUninstall}
                  disabled={installing || !isValidPath}
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Uninstall</span>
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full text-gray-900 border-gray-600 transition-colors py-6 text-lg flex items-center justify-center bg-gray-100 hover:bg-gray-400"
                onClick={handleExit}
              >
                <X className="w-5 h-5" />
                <span>Exit</span>
              </Button>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100 border border-gray-700">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="text-sm">
                  {description}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 pb-4">{children}</div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-purple-300 text-gray-800 hover:bg-purple-400 active:bg-purple-500">
                    OK
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {status && (
          <div className="relative h-[57px] p-4 text-center border-t border-gray-700 bg-gray-800">
            <p className="text-purple-300">{status}</p>
          </div>
        )}
      </div>
    )) || (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <svg
          role="status"
          className="inline w-4 h-4 me-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        <p>Connecting...</p>
      </div>
    )
  );
}
