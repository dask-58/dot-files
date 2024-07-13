var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/arg@5.0.2/node_modules/arg/index.js
var require_arg = __commonJS({
  "../../node_modules/.pnpm/arg@5.0.2/node_modules/arg/index.js"(exports, module) {
    var flagSymbol = Symbol("arg flag");
    var ArgError = class _ArgError extends Error {
      constructor(msg, code) {
        super(msg);
        this.name = "ArgError";
        this.code = code;
        Object.setPrototypeOf(this, _ArgError.prototype);
      }
    };
    function arg2(opts, {
      argv = process.argv.slice(2),
      permissive = false,
      stopAtPositional = false
    } = {}) {
      if (!opts) {
        throw new ArgError(
          "argument specification object is required",
          "ARG_CONFIG_NO_SPEC"
        );
      }
      const result = { _: [] };
      const aliases = {};
      const handlers = {};
      for (const key of Object.keys(opts)) {
        if (!key) {
          throw new ArgError(
            "argument key cannot be an empty string",
            "ARG_CONFIG_EMPTY_KEY"
          );
        }
        if (key[0] !== "-") {
          throw new ArgError(
            `argument key must start with '-' but found: '${key}'`,
            "ARG_CONFIG_NONOPT_KEY"
          );
        }
        if (key.length === 1) {
          throw new ArgError(
            `argument key must have a name; singular '-' keys are not allowed: ${key}`,
            "ARG_CONFIG_NONAME_KEY"
          );
        }
        if (typeof opts[key] === "string") {
          aliases[key] = opts[key];
          continue;
        }
        let type = opts[key];
        let isFlag = false;
        if (Array.isArray(type) && type.length === 1 && typeof type[0] === "function") {
          const [fn] = type;
          type = (value, name, prev = []) => {
            prev.push(fn(value, name, prev[prev.length - 1]));
            return prev;
          };
          isFlag = fn === Boolean || fn[flagSymbol] === true;
        } else if (typeof type === "function") {
          isFlag = type === Boolean || type[flagSymbol] === true;
        } else {
          throw new ArgError(
            `type missing or not a function or valid array type: ${key}`,
            "ARG_CONFIG_VAD_TYPE"
          );
        }
        if (key[1] !== "-" && key.length > 2) {
          throw new ArgError(
            `short argument keys (with a single hyphen) must have only one character: ${key}`,
            "ARG_CONFIG_SHORTOPT_TOOLONG"
          );
        }
        handlers[key] = [type, isFlag];
      }
      for (let i = 0, len = argv.length; i < len; i++) {
        const wholeArg = argv[i];
        if (stopAtPositional && result._.length > 0) {
          result._ = result._.concat(argv.slice(i));
          break;
        }
        if (wholeArg === "--") {
          result._ = result._.concat(argv.slice(i + 1));
          break;
        }
        if (wholeArg.length > 1 && wholeArg[0] === "-") {
          const separatedArguments = wholeArg[1] === "-" || wholeArg.length === 2 ? [wholeArg] : wholeArg.slice(1).split("").map((a) => `-${a}`);
          for (let j = 0; j < separatedArguments.length; j++) {
            const arg3 = separatedArguments[j];
            const [originalArgName, argStr] = arg3[1] === "-" ? arg3.split(/=(.*)/, 2) : [arg3, void 0];
            let argName = originalArgName;
            while (argName in aliases) {
              argName = aliases[argName];
            }
            if (!(argName in handlers)) {
              if (permissive) {
                result._.push(arg3);
                continue;
              } else {
                throw new ArgError(
                  `unknown or unexpected option: ${originalArgName}`,
                  "ARG_UNKNOWN_OPTION"
                );
              }
            }
            const [type, isFlag] = handlers[argName];
            if (!isFlag && j + 1 < separatedArguments.length) {
              throw new ArgError(
                `option requires argument (but was followed by another short argument): ${originalArgName}`,
                "ARG_MISSING_REQUIRED_SHORTARG"
              );
            }
            if (isFlag) {
              result[argName] = type(true, argName, result[argName]);
            } else if (argStr === void 0) {
              if (argv.length < i + 2 || argv[i + 1].length > 1 && argv[i + 1][0] === "-" && !(argv[i + 1].match(/^-?\d*(\.(?=\d))?\d*$/) && (type === Number || // eslint-disable-next-line no-undef
              typeof BigInt !== "undefined" && type === BigInt))) {
                const extended = originalArgName === argName ? "" : ` (alias for ${argName})`;
                throw new ArgError(
                  `option requires argument: ${originalArgName}${extended}`,
                  "ARG_MISSING_REQUIRED_LONGARG"
                );
              }
              result[argName] = type(argv[i + 1], argName, result[argName]);
              ++i;
            } else {
              result[argName] = type(argStr, argName, result[argName]);
            }
          }
        } else {
          result._.push(wholeArg);
        }
      }
      return result;
    }
    arg2.flag = (fn) => {
      fn[flagSymbol] = true;
      return fn;
    };
    arg2.COUNT = arg2.flag((v, name, existingCount) => (existingCount || 0) + 1);
    arg2.ArgError = ArgError;
    module.exports = arg2;
  }
});

// src/actions/context.ts
var import_arg = __toESM(require_arg(), 1);
import os from "node:os";
import { prompt } from "@astrojs/cli-kit";
import { random } from "@astrojs/cli-kit/utils";

// src/data/seasonal.ts
function getSeasonalHouston({ fancy }) {
  const season = getSeason();
  switch (season) {
    case "new-year": {
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      return {
        hats: rarity(0.5, ["\u{1F3A9}"]),
        ties: rarity(0.25, ["\u{1F38A}", "\u{1F380}", "\u{1F389}"]),
        messages: [
          `New year, new Astro site!`,
          `Kicking ${year} off with Astro?! What an honor!`,
          `Happy ${year}! Let's make something cool.`,
          `${year} is your year! Let's build something awesome.`,
          `${year} is the year of Astro!`,
          `${year} is clearly off to a great start!`,
          `Thanks for starting ${year} with Astro!`
        ]
      };
    }
    case "spooky":
      return {
        hats: rarity(0.5, ["\u{1F383}", "\u{1F47B}", "\u2620\uFE0F", "\u{1F480}", "\u{1F577}\uFE0F", "\u{1F52E}"]),
        ties: rarity(0.25, ["\u{1F9B4}", "\u{1F36C}", "\u{1F36B}"]),
        messages: [
          `I'm afraid I can't help you... Just kidding!`,
          `Boo! Just kidding. Let's make a website!`,
          `Let's haunt the internet. OooOooOOoo!`,
          `No tricks here. Seeing you is always treat!`,
          `Spiders aren't the only ones building the web!`,
          `Let's conjure up some web magic!`,
          `Let's harness the power of Astro to build a frightful new site!`,
          `We're conjuring up a spooktacular website!`,
          `Prepare for a web of spooky wonders to be woven.`,
          `Chills and thrills await you on your new project!`
        ]
      };
    case "holiday":
      return {
        hats: rarity(0.75, ["\u{1F381}", "\u{1F384}", "\u{1F332}"]),
        ties: rarity(0.75, ["\u{1F9E3}"]),
        messages: [
          `'Tis the season to code and create.`,
          `Jingle all the way through your web creation journey!`,
          `Bells are ringing, and so are your creative ideas!`,
          `Let's make the internet our own winter wonderland!`,
          `It's time to decorate a brand new website!`,
          `Let's unwrap the magic of the web together!`,
          `Hope you're enjoying the holiday season!`,
          `I'm dreaming of a brand new website!`,
          `No better holiday gift than a new site!`,
          `Your creativity is the gift that keeps on giving!`
        ]
      };
    default:
      return {
        hats: fancy ? ["\u{1F3A9}", "\u{1F3A9}", "\u{1F3A9}", "\u{1F3A9}", "\u{1F393}", "\u{1F451}", "\u{1F9E2}", "\u{1F366}"] : void 0,
        ties: fancy ? rarity(0.33, ["\u{1F380}", "\u{1F9E3}"]) : void 0,
        messages: [
          `Let's claim your corner of the internet.`,
          `I'll be your assistant today.`,
          `Let's build something awesome!`,
          `Let's build something great!`,
          `Let's build something fast!`,
          `Let's build the web we want.`,
          `Let's make the web weird!`,
          `Let's make the web a better place!`,
          `Let's create a new project!`,
          `Let's create something unique!`,
          `Time to build a new website.`,
          `Time to build a faster website.`,
          `Time to build a sweet new website.`,
          `We're glad to have you on board.`,
          `Keeping the internet weird since 2021.`,
          `Initiating launch sequence...`,
          `Initiating launch sequence... right... now!`,
          `Awaiting further instructions.`
        ]
      };
  }
}
function getSeason() {
  const date = /* @__PURE__ */ new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate() + 1;
  if (month === 1 && day <= 7) {
    return "new-year";
  }
  if (month === 10 && day > 7) {
    return "spooky";
  }
  if (month === 12 && day > 7 && day < 25) {
    return "holiday";
  }
}
function rarity(frequency, emoji) {
  if (frequency === 1)
    return emoji;
  if (frequency === 0)
    return [""];
  const empty = Array.from({ length: Math.round(emoji.length * frequency) }, () => "");
  return [...emoji, ...empty];
}

// src/messages.ts
import { exec } from "node:child_process";
import { color, label, say as houston, spinner as load } from "@astrojs/cli-kit";
import { align, sleep } from "@astrojs/cli-kit/utils";

// ../../node_modules/.pnpm/ansi-regex@6.0.1/node_modules/ansi-regex/index.js
function ansiRegex({ onlyFirst = false } = {}) {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
  ].join("|");
  return new RegExp(pattern, onlyFirst ? void 0 : "g");
}

// ../../node_modules/.pnpm/strip-ansi@7.1.0/node_modules/strip-ansi/index.js
var regex = ansiRegex();
function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }
  return string.replace(regex, "");
}

// src/shell.ts
import { spawn } from "node:child_process";
import { text as textFromStream } from "node:stream/consumers";
var text = (stream) => stream ? textFromStream(stream).then((t) => t.trimEnd()) : "";
async function shell(command, flags, opts = {}) {
  let child;
  let stdout2 = "";
  let stderr = "";
  try {
    child = spawn(command, flags, {
      cwd: opts.cwd,
      shell: true,
      stdio: opts.stdio,
      timeout: opts.timeout
    });
    const done = new Promise((resolve) => child.on("close", resolve));
    [stdout2, stderr] = await Promise.all([text(child.stdout), text(child.stderr)]);
    await done;
  } catch (e) {
    throw { stdout: stdout2, stderr, exitCode: 1 };
  }
  const { exitCode } = child;
  if (exitCode === null) {
    throw new Error("Timeout");
  }
  if (exitCode !== 0) {
    throw new Error(stderr);
  }
  return { stdout: stdout2, stderr, exitCode };
}

// src/messages.ts
var _registry;
async function getRegistry(packageManager) {
  if (_registry)
    return _registry;
  const fallback = "https://registry.npmjs.org";
  try {
    const { stdout: stdout2 } = await shell(packageManager, ["config", "get", "registry"]);
    _registry = stdout2?.trim()?.replace(/\/$/, "") || fallback;
    if (!new URL(_registry).host)
      _registry = fallback;
  } catch (e) {
    _registry = fallback;
  }
  return _registry;
}
var stdout = process.stdout;
function setStdout(writable) {
  stdout = writable;
}
async function say(messages, { clear = false, hat = "", tie = "" } = {}) {
  return houston(messages, { clear, hat, tie, stdout });
}
var title = (text2) => align(label(text2), "end", 7) + " ";
var getName = () => new Promise((resolve) => {
  exec("git config user.name", { encoding: "utf-8" }, (_1, gitName) => {
    if (gitName.trim()) {
      return resolve(gitName.split(" ")[0].trim());
    }
    exec("whoami", { encoding: "utf-8" }, (_3, whoami) => {
      if (whoami.trim()) {
        return resolve(whoami.split(" ")[0].trim());
      }
      return resolve("astronaut");
    });
  });
});
var getVersion = (packageManager, packageName, fallback = "") => new Promise(async (resolve) => {
  let registry = await getRegistry(packageManager);
  const { version } = await fetch(`${registry}/${packageName}/latest`, {
    redirect: "follow"
  }).then((res) => res.json()).catch(() => ({ version: fallback }));
  return resolve(version);
});
var log = (message) => stdout.write(message + "\n");
var banner = () => {
  const prefix = `astro`;
  const suffix = `Launch sequence initiated.`;
  log(`${label(prefix, color.bgGreen, color.black)}  ${suffix}`);
};
var bannerAbort = () => log(`
${label("astro", color.bgRed)} ${color.bold("Launch sequence aborted.")}`);
var info = async (prefix, text2) => {
  await sleep(100);
  if (stdout.columns < 80) {
    log(`${" ".repeat(5)} ${color.cyan("\u25FC")}  ${color.cyan(prefix)}`);
    log(`${" ".repeat(9)}${color.dim(text2)}`);
  } else {
    log(`${" ".repeat(5)} ${color.cyan("\u25FC")}  ${color.cyan(prefix)} ${color.dim(text2)}`);
  }
};
var error = async (prefix, text2) => {
  if (stdout.columns < 80) {
    log(`${" ".repeat(5)} ${color.red("\u25B2")}  ${color.red(prefix)}`);
    log(`${" ".repeat(9)}${color.dim(text2)}`);
  } else {
    log(`${" ".repeat(5)} ${color.red("\u25B2")}  ${color.red(prefix)} ${color.dim(text2)}`);
  }
};
var typescriptByDefault = async () => {
  await info(`No worries!`, "TypeScript is supported in Astro by default,");
  log(`${" ".repeat(9)}${color.dim("but you are free to continue writing JavaScript instead.")}`);
  await sleep(1e3);
};
var nextSteps = async ({ projectDir, devCmd }) => {
  const max = stdout.columns;
  const prefix = max < 80 ? " " : " ".repeat(9);
  await sleep(200);
  log(
    `
 ${color.bgCyan(` ${color.black("next")} `)}  ${color.bold(
      "Liftoff confirmed. Explore your project!"
    )}`
  );
  await sleep(100);
  if (projectDir !== "") {
    projectDir = projectDir.includes(" ") ? `"./${projectDir}"` : `./${projectDir}`;
    const enter = [
      `
${prefix}Enter your project directory using`,
      color.cyan(`cd ${projectDir}`, "")
    ];
    const len = enter[0].length + stripAnsi(enter[1]).length;
    log(enter.join(len > max ? "\n" + prefix : " "));
  }
  log(
    `${prefix}Run ${color.cyan(devCmd)} to start the dev server. ${color.cyan("CTRL+C")} to stop.`
  );
  await sleep(100);
  log(
    `${prefix}Add frameworks like ${color.cyan(`react`)} or ${color.cyan(
      "tailwind"
    )} using ${color.cyan("astro add")}.`
  );
  await sleep(100);
  log(`
${prefix}Stuck? Join us at ${color.cyan(`https://astro.build/chat`)}`);
  await sleep(200);
};
function printHelp({
  commandName,
  headline,
  usage,
  tables,
  description
}) {
  const linebreak = () => "";
  const table = (rows, { padding }) => {
    const split = stdout.columns < 60;
    let raw = "";
    for (const row of rows) {
      if (split) {
        raw += `    ${row[0]}
    `;
      } else {
        raw += `${`${row[0]}`.padStart(padding)}`;
      }
      raw += "  " + color.dim(row[1]) + "\n";
    }
    return raw.slice(0, -1);
  };
  let message = [];
  if (headline) {
    message.push(
      linebreak(),
      `${title(commandName)} ${color.green(`v${"4.8.0"}`)} ${headline}`
    );
  }
  if (usage) {
    message.push(linebreak(), `${color.green(commandName)} ${color.bold(usage)}`);
  }
  if (tables) {
    let calculateTablePadding2 = function(rows) {
      return rows.reduce((val, [first]) => Math.max(val, first.length), 0);
    };
    var calculateTablePadding = calculateTablePadding2;
    const tableEntries = Object.entries(tables);
    const padding = Math.max(...tableEntries.map(([, rows]) => calculateTablePadding2(rows)));
    for (const [, tableRows] of tableEntries) {
      message.push(linebreak(), table(tableRows, { padding }));
    }
  }
  if (description) {
    message.push(linebreak(), `${description}`);
  }
  log(message.join("\n") + "\n");
}

// src/actions/context.ts
async function getContext(argv) {
  const flags = (0, import_arg.default)(
    {
      "--template": String,
      "--ref": String,
      "--yes": Boolean,
      "--no": Boolean,
      "--install": Boolean,
      "--no-install": Boolean,
      "--git": Boolean,
      "--no-git": Boolean,
      "--typescript": String,
      "--skip-houston": Boolean,
      "--dry-run": Boolean,
      "--help": Boolean,
      "--fancy": Boolean,
      "-y": "--yes",
      "-n": "--no",
      "-h": "--help"
    },
    { argv, permissive: true }
  );
  const packageManager = detectPackageManager() ?? "npm";
  let cwd = flags["_"][0];
  let {
    "--help": help2 = false,
    "--template": template2,
    "--no": no,
    "--yes": yes,
    "--install": install2,
    "--no-install": noInstall,
    "--git": git2,
    "--no-git": noGit,
    "--typescript": typescript2,
    "--fancy": fancy,
    "--skip-houston": skipHouston,
    "--dry-run": dryRun,
    "--ref": ref
  } = flags;
  let projectName2 = cwd;
  if (no) {
    yes = false;
    if (install2 == void 0)
      install2 = false;
    if (git2 == void 0)
      git2 = false;
    if (typescript2 == void 0)
      typescript2 = "strict";
  }
  skipHouston = (os.platform() === "win32" && !fancy || skipHouston) ?? [yes, no, install2, git2, typescript2].some((v) => v !== void 0);
  const { messages, hats, ties } = getSeasonalHouston({ fancy });
  const context = {
    help: help2,
    prompt,
    packageManager,
    username: getName(),
    version: getVersion(packageManager, "astro", "4.6.0"),
    skipHouston,
    fancy,
    dryRun,
    projectName: projectName2,
    template: template2,
    ref: ref ?? "latest",
    welcome: random(messages),
    hat: hats ? random(hats) : void 0,
    tie: ties ? random(ties) : void 0,
    yes,
    install: install2 ?? (noInstall ? false : void 0),
    git: git2 ?? (noGit ? false : void 0),
    typescript: typescript2,
    cwd,
    exit(code) {
      process.exit(code);
    },
    tasks: []
  };
  return context;
}
function detectPackageManager() {
  if (!process.env.npm_config_user_agent)
    return;
  const specifier = process.env.npm_config_user_agent.split(" ")[0];
  const name = specifier.substring(0, specifier.lastIndexOf("/"));
  return name === "npminstall" ? "cnpm" : name;
}

// src/index.ts
import { tasks } from "@astrojs/cli-kit";

// src/actions/dependencies.ts
import fs from "node:fs";
import path from "node:path";
import { color as color2 } from "@astrojs/cli-kit";
async function dependencies(ctx) {
  let deps = ctx.install ?? ctx.yes;
  if (deps === void 0) {
    ({ deps } = await ctx.prompt({
      name: "deps",
      type: "confirm",
      label: title("deps"),
      message: `Install dependencies?`,
      hint: "recommended",
      initial: true
    }));
    ctx.install = deps;
  }
  if (ctx.dryRun) {
    await info("--dry-run", `Skipping dependency installation`);
  } else if (deps) {
    ctx.tasks.push({
      pending: "Dependencies",
      start: `Dependencies installing with ${ctx.packageManager}...`,
      end: "Dependencies installed",
      onError: (e) => {
        error("error", e);
        error(
          "error",
          `Dependencies failed to install, please run ${color2.bold(
            ctx.packageManager + " install"
          )} to install them manually after setup.`
        );
      },
      while: () => install({ packageManager: ctx.packageManager, cwd: ctx.cwd })
    });
  } else {
    await info(
      ctx.yes === false ? "deps [skip]" : "No problem!",
      "Remember to install dependencies after setup."
    );
  }
}
async function install({ packageManager, cwd }) {
  if (packageManager === "yarn")
    await ensureYarnLock({ cwd });
  return shell(packageManager, ["install"], { cwd, timeout: 9e4, stdio: "ignore" });
}
async function ensureYarnLock({ cwd }) {
  const yarnLock = path.join(cwd, "yarn.lock");
  if (fs.existsSync(yarnLock))
    return;
  return fs.promises.writeFile(yarnLock, "", { encoding: "utf-8" });
}

// src/actions/git.ts
import fs2 from "node:fs";
import path2 from "node:path";
import { color as color3 } from "@astrojs/cli-kit";
async function git(ctx) {
  if (fs2.existsSync(path2.join(ctx.cwd, ".git"))) {
    await info("Nice!", `Git has already been initialized`);
    return;
  }
  let _git = ctx.git ?? ctx.yes;
  if (_git === void 0) {
    ({ git: _git } = await ctx.prompt({
      name: "git",
      type: "confirm",
      label: title("git"),
      message: `Initialize a new git repository?`,
      hint: "optional",
      initial: true
    }));
  }
  if (ctx.dryRun) {
    await info("--dry-run", `Skipping Git initialization`);
  } else if (_git) {
    ctx.tasks.push({
      pending: "Git",
      start: "Git initializing...",
      end: "Git initialized",
      while: () => init({ cwd: ctx.cwd }).catch((e) => {
        error("error", e);
        process.exit(1);
      })
    });
  } else {
    await info(
      ctx.yes === false ? "git [skip]" : "Sounds good!",
      `You can always run ${color3.reset("git init")}${color3.dim(" manually.")}`
    );
  }
}
async function init({ cwd }) {
  try {
    await shell("git", ["init"], { cwd, stdio: "ignore" });
    await shell("git", ["add", "-A"], { cwd, stdio: "ignore" });
    await shell(
      "git",
      [
        "commit",
        "-m",
        "Initial commit from Astro",
        '--author="houston[bot] <astrobot-houston@users.noreply.github.com>"'
      ],
      { cwd, stdio: "ignore" }
    );
  } catch (e) {
  }
}

// src/actions/help.ts
function help() {
  printHelp({
    commandName: "create-astro",
    usage: "[dir] [...flags]",
    headline: "Scaffold Astro projects.",
    tables: {
      Flags: [
        ["--help (-h)", "See all available flags."],
        ["--template <name>", "Specify your template."],
        ["--install / --no-install", "Install dependencies (or not)."],
        ["--git / --no-git", "Initialize git repo (or not)."],
        ["--yes (-y)", "Skip all prompts by accepting defaults."],
        ["--no (-n)", "Skip all prompts by declining defaults."],
        ["--dry-run", "Walk through steps without executing."],
        ["--skip-houston", "Skip Houston animation."],
        ["--ref", "Choose astro branch (default: latest)."],
        ["--fancy", "Enable full Unicode support for Windows."],
        ["--typescript <option>", "TypeScript option: strict | strictest | relaxed."]
      ]
    }
  });
}

// src/actions/intro.ts
import { color as color4, label as label2 } from "@astrojs/cli-kit";
async function intro(ctx) {
  banner();
  if (!ctx.skipHouston) {
    const { welcome, hat, tie } = ctx;
    await say(
      [
        [
          "Welcome",
          "to",
          label2("astro", color4.bgGreen, color4.black),
          Promise.resolve(ctx.version).then(
            (version) => (version ? color4.green(`v${version}`) : "") + ","
          ),
          Promise.resolve(ctx.username).then((username) => `${username}!`)
        ],
        welcome ?? "Let's build something awesome!"
      ],
      { clear: true, hat, tie }
    );
  }
}

// src/actions/next-steps.ts
import path3 from "node:path";
async function next(ctx) {
  let projectDir = path3.relative(process.cwd(), ctx.cwd);
  const commandMap = {
    npm: "npm run dev",
    bun: "bun run dev",
    yarn: "yarn dev",
    pnpm: "pnpm dev"
  };
  const devCmd = commandMap[ctx.packageManager] || "npm run dev";
  await nextSteps({ projectDir, devCmd });
  if (!ctx.skipHouston) {
    await say(["Good luck out there, astronaut! \u{1F680}"], { hat: ctx.hat, tie: ctx.tie });
  }
  return;
}

// src/actions/project-name.ts
import path4 from "node:path";
import { color as color5, generateProjectName } from "@astrojs/cli-kit";

// src/actions/shared.ts
import fs3 from "node:fs";
var VALID_PROJECT_DIRECTORY_SAFE_LIST = [
  ".DS_Store",
  ".git",
  ".gitkeep",
  ".gitattributes",
  ".gitignore",
  ".gitlab-ci.yml",
  ".hg",
  ".hgcheck",
  ".hgignore",
  ".idea",
  ".npmignore",
  ".travis.yml",
  ".yarn",
  ".yarnrc.yml",
  "docs",
  "LICENSE",
  "mkdocs.yml",
  "Thumbs.db",
  /\.iml$/,
  /^npm-debug\.log/,
  /^yarn-debug\.log/,
  /^yarn-error\.log/
];
function isEmpty(dirPath) {
  if (!fs3.existsSync(dirPath)) {
    return true;
  }
  const conflicts = fs3.readdirSync(dirPath).filter((content) => {
    return !VALID_PROJECT_DIRECTORY_SAFE_LIST.some((safeContent) => {
      return typeof safeContent === "string" ? content === safeContent : safeContent.test(content);
    });
  });
  return conflicts.length === 0;
}
function isValidName(projectName2) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName2);
}
function toValidName(projectName2) {
  if (isValidName(projectName2))
    return projectName2;
  return projectName2.trim().toLowerCase().replace(/\s+/g, "-").replace(/^[._]/, "").replace(/[^a-z\d\-~]+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}

// src/actions/project-name.ts
async function projectName(ctx) {
  await checkCwd(ctx.cwd);
  if (!ctx.cwd || !isEmpty(ctx.cwd)) {
    if (!isEmpty(ctx.cwd)) {
      await info("Hmm...", `${color5.reset(`"${ctx.cwd}"`)}${color5.dim(` is not empty!`)}`);
    }
    if (ctx.yes) {
      ctx.projectName = generateProjectName();
      ctx.cwd = `./${ctx.projectName}`;
      await info("dir", `Project created at ./${ctx.projectName}`);
      return;
    }
    const { name } = await ctx.prompt({
      name: "name",
      type: "text",
      label: title("dir"),
      message: "Where should we create your new project?",
      initial: `./${generateProjectName()}`,
      validate(value) {
        if (!isEmpty(value)) {
          return `Directory is not empty!`;
        }
        if (value.match(/[^\x20-\x7E]/g) !== null)
          return `Invalid non-printable character present!`;
        return true;
      }
    });
    ctx.cwd = name.trim();
    ctx.projectName = toValidName(name);
    if (ctx.dryRun) {
      await info("--dry-run", "Skipping project naming");
      return;
    }
  } else {
    let name = ctx.cwd;
    if (name === "." || name === "./") {
      const parts = process.cwd().split(path4.sep);
      name = parts[parts.length - 1];
    } else if (name.startsWith("./") || name.startsWith("../")) {
      const parts = name.split("/");
      name = parts[parts.length - 1];
    }
    ctx.projectName = toValidName(name);
  }
  if (!ctx.cwd) {
    ctx.exit(1);
  }
}
async function checkCwd(cwd) {
  const empty = cwd && isEmpty(cwd);
  if (empty) {
    log("");
    await info("dir", `Using ${color5.reset(cwd)}${color5.dim(" as project directory")}`);
  }
  return empty;
}

// src/actions/template.ts
import fs4 from "node:fs";
import path5 from "node:path";
import { color as color6 } from "@astrojs/cli-kit";
import { downloadTemplate } from "giget";
async function template(ctx) {
  if (!ctx.template && ctx.yes)
    ctx.template = "basics";
  if (ctx.template) {
    await info("tmpl", `Using ${color6.reset(ctx.template)}${color6.dim(" as project template")}`);
  } else {
    const { template: tmpl } = await ctx.prompt({
      name: "template",
      type: "select",
      label: title("tmpl"),
      message: "How would you like to start your new project?",
      initial: "basics",
      choices: [
        { value: "basics", label: "Include sample files", hint: "(recommended)" },
        { value: "blog", label: "Use blog template" },
        { value: "minimal", label: "Empty" }
      ]
    });
    ctx.template = tmpl;
  }
  if (ctx.dryRun) {
    await info("--dry-run", `Skipping template copying`);
  } else if (ctx.template) {
    ctx.tasks.push({
      pending: "Template",
      start: "Template copying...",
      end: "Template copied",
      while: () => copyTemplate(ctx.template, ctx).catch((e) => {
        if (e instanceof Error) {
          error("error", e.message);
          process.exit(1);
        } else {
          error("error", "Unable to clone template.");
          process.exit(1);
        }
      })
    });
  } else {
    ctx.exit(1);
  }
}
var FILES_TO_REMOVE = ["CHANGELOG.md", ".codesandbox"];
var FILES_TO_UPDATE = {
  "package.json": (file, overrides) => fs4.promises.readFile(file, "utf-8").then((value) => {
    const indent = /(^\s+)/m.exec(value)?.[1] ?? "	";
    return fs4.promises.writeFile(
      file,
      JSON.stringify(
        Object.assign(JSON.parse(value), Object.assign(overrides, { private: void 0 })),
        null,
        indent
      ),
      "utf-8"
    );
  })
};
function getTemplateTarget(tmpl, ref = "latest") {
  if (tmpl.startsWith("starlight")) {
    const [, starter = "basics"] = tmpl.split("/");
    return `withastro/starlight/examples/${starter}`;
  }
  const isThirdParty = tmpl.includes("/");
  if (isThirdParty)
    return tmpl;
  return `github:withastro/astro/examples/${tmpl}#${ref}`;
}
async function copyTemplate(tmpl, ctx) {
  const templateTarget = getTemplateTarget(tmpl, ctx.ref);
  if (!ctx.dryRun) {
    try {
      await downloadTemplate(templateTarget, {
        force: true,
        provider: "github",
        cwd: ctx.cwd,
        dir: "."
      });
    } catch (err) {
      if (ctx.cwd !== "." && ctx.cwd !== "./" && !ctx.cwd.startsWith("../")) {
        try {
          fs4.rmdirSync(ctx.cwd);
        } catch (_) {
        }
      }
      if (err.message.includes("404")) {
        throw new Error(`Template ${color6.reset(tmpl)} ${color6.dim("does not exist!")}`);
      } else {
        throw new Error(err.message);
      }
    }
    if (fs4.readdirSync(ctx.cwd).length === 0) {
      throw new Error(`Template ${color6.reset(tmpl)} ${color6.dim("is empty!")}`);
    }
    const removeFiles = FILES_TO_REMOVE.map(async (file) => {
      const fileLoc = path5.resolve(path5.join(ctx.cwd, file));
      if (fs4.existsSync(fileLoc)) {
        return fs4.promises.rm(fileLoc, { recursive: true });
      }
    });
    const updateFiles = Object.entries(FILES_TO_UPDATE).map(async ([file, update]) => {
      const fileLoc = path5.resolve(path5.join(ctx.cwd, file));
      if (fs4.existsSync(fileLoc)) {
        return update(fileLoc, { name: ctx.projectName });
      }
    });
    await Promise.all([...removeFiles, ...updateFiles]);
  }
}

// src/actions/typescript.ts
import { readFile, rm, writeFile } from "node:fs/promises";
import path6 from "node:path";
import { color as color7 } from "@astrojs/cli-kit";

// ../../node_modules/.pnpm/strip-json-comments@5.0.1/node_modules/strip-json-comments/index.js
var singleComment = Symbol("singleComment");
var multiComment = Symbol("multiComment");
var stripWithoutWhitespace = () => "";
var stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(/\S/g, " ");
var isEscaped = (jsonString, quotePosition) => {
  let index = quotePosition - 1;
  let backslashCount = 0;
  while (jsonString[index] === "\\") {
    index -= 1;
    backslashCount += 1;
  }
  return Boolean(backslashCount % 2);
};
function stripJsonComments(jsonString, { whitespace = true, trailingCommas = false } = {}) {
  if (typeof jsonString !== "string") {
    throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
  }
  const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
  let isInsideString = false;
  let isInsideComment = false;
  let offset = 0;
  let buffer = "";
  let result = "";
  let commaIndex = -1;
  for (let index = 0; index < jsonString.length; index++) {
    const currentCharacter = jsonString[index];
    const nextCharacter = jsonString[index + 1];
    if (!isInsideComment && currentCharacter === '"') {
      const escaped = isEscaped(jsonString, index);
      if (!escaped) {
        isInsideString = !isInsideString;
      }
    }
    if (isInsideString) {
      continue;
    }
    if (!isInsideComment && currentCharacter + nextCharacter === "//") {
      buffer += jsonString.slice(offset, index);
      offset = index;
      isInsideComment = singleComment;
      index++;
    } else if (isInsideComment === singleComment && currentCharacter + nextCharacter === "\r\n") {
      index++;
      isInsideComment = false;
      buffer += strip(jsonString, offset, index);
      offset = index;
      continue;
    } else if (isInsideComment === singleComment && currentCharacter === "\n") {
      isInsideComment = false;
      buffer += strip(jsonString, offset, index);
      offset = index;
    } else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
      buffer += jsonString.slice(offset, index);
      offset = index;
      isInsideComment = multiComment;
      index++;
      continue;
    } else if (isInsideComment === multiComment && currentCharacter + nextCharacter === "*/") {
      index++;
      isInsideComment = false;
      buffer += strip(jsonString, offset, index + 1);
      offset = index + 1;
      continue;
    } else if (trailingCommas && !isInsideComment) {
      if (commaIndex !== -1) {
        if (currentCharacter === "}" || currentCharacter === "]") {
          buffer += jsonString.slice(offset, index);
          result += strip(buffer, 0, 1) + buffer.slice(1);
          buffer = "";
          offset = index;
          commaIndex = -1;
        } else if (currentCharacter !== " " && currentCharacter !== "	" && currentCharacter !== "\r" && currentCharacter !== "\n") {
          buffer += jsonString.slice(offset, index);
          offset = index;
          commaIndex = -1;
        }
      } else if (currentCharacter === ",") {
        result += buffer + jsonString.slice(offset, index);
        buffer = "";
        offset = index;
        commaIndex = index;
      }
    }
  }
  return result + buffer + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
}

// src/actions/typescript.ts
async function typescript(ctx) {
  let ts = ctx.typescript ?? (typeof ctx.yes !== "undefined" ? "strict" : void 0);
  if (ts === void 0) {
    const { useTs } = await ctx.prompt({
      name: "useTs",
      type: "confirm",
      label: title("ts"),
      message: `Do you plan to write TypeScript?`,
      initial: true
    });
    if (!useTs) {
      await typescriptByDefault();
      return;
    }
    ({ ts } = await ctx.prompt({
      name: "ts",
      type: "select",
      label: title("use"),
      message: `How strict should TypeScript be?`,
      initial: "strict",
      choices: [
        { value: "strict", label: "Strict", hint: `(recommended)` },
        { value: "strictest", label: "Strictest" },
        { value: "base", label: "Relaxed" }
      ]
    }));
  } else {
    if (!["strict", "strictest", "relaxed", "default", "base"].includes(ts)) {
      if (!ctx.dryRun) {
        await rm(ctx.cwd, { recursive: true, force: true });
      }
      error(
        "Error",
        `Unknown TypeScript option ${color7.reset(ts)}${color7.dim(
          "! Expected strict | strictest | relaxed"
        )}`
      );
      ctx.exit(1);
    }
    await info("ts", `Using ${color7.reset(ts)}${color7.dim(" TypeScript configuration")}`);
  }
  if (ctx.dryRun) {
    await info("--dry-run", `Skipping TypeScript setup`);
  } else if (ts && ts !== "unsure") {
    if (ts === "relaxed" || ts === "default") {
      ts = "base";
    }
    ctx.tasks.push({
      pending: "TypeScript",
      start: "TypeScript customizing...",
      end: "TypeScript customized",
      while: () => setupTypeScript(ts, ctx).catch((e) => {
        error("error", e);
        process.exit(1);
      })
    });
  } else {
  }
}
var FILES_TO_UPDATE2 = {
  "package.json": async (file, options) => {
    try {
      const data = await readFile(file, { encoding: "utf-8" });
      const indent = /(^\s+)/m.exec(data)?.[1] ?? "	";
      const parsedPackageJson = JSON.parse(data);
      const buildScript = parsedPackageJson.scripts?.build;
      if (typeof buildScript === "string" && !buildScript.includes("astro check")) {
        parsedPackageJson.scripts.build = `astro check && ${buildScript}`;
      }
      const [astroCheckVersion, typescriptVersion] = await Promise.all([
        getVersion(options.ctx.packageManager, "@astrojs/check", "0.5.8"),
        getVersion(options.ctx.packageManager, "typescript", "5.2.2")
      ]);
      parsedPackageJson.dependencies ??= {};
      parsedPackageJson.dependencies["@astrojs/check"] = `^${astroCheckVersion}`;
      parsedPackageJson.dependencies.typescript = `^${typescriptVersion}`;
      await writeFile(file, JSON.stringify(parsedPackageJson, null, indent), "utf-8");
    } catch (err) {
      if (err && err.code === "ENOENT")
        return;
      if (err instanceof Error)
        throw new Error(err.message);
    }
  },
  "tsconfig.json": async (file, options) => {
    try {
      const data = await readFile(file, { encoding: "utf-8" });
      const templateTSConfig = JSON.parse(stripJsonComments(data));
      if (templateTSConfig && typeof templateTSConfig === "object") {
        const result = Object.assign(templateTSConfig, {
          extends: `astro/tsconfigs/${options.value}`
        });
        await writeFile(file, JSON.stringify(result, null, 2));
      } else {
        throw new Error(
          "There was an error applying the requested TypeScript settings. This could be because the template's tsconfig.json is malformed"
        );
      }
    } catch (err) {
      if (err && err.code === "ENOENT") {
        await writeFile(
          file,
          JSON.stringify({ extends: `astro/tsconfigs/${options.value}` }, null, 2)
        );
      }
    }
  }
};
async function setupTypeScript(value, ctx) {
  await Promise.all(
    Object.entries(FILES_TO_UPDATE2).map(
      async ([file, update]) => update(path6.resolve(path6.join(ctx.cwd, file)), { value, ctx })
    )
  );
}

// src/actions/verify.ts
import dns from "node:dns/promises";
import { color as color8 } from "@astrojs/cli-kit";
async function verify(ctx) {
  if (!ctx.dryRun) {
    const online = await isOnline();
    if (!online) {
      bannerAbort();
      log("");
      error("error", `Unable to connect to the internet.`);
      ctx.exit(1);
    }
  }
  if (ctx.template) {
    const ok = await verifyTemplate(ctx.template, ctx.ref);
    if (!ok) {
      bannerAbort();
      log("");
      error("error", `Template ${color8.reset(ctx.template)} ${color8.dim("could not be found!")}`);
      await info("check", "https://astro.build/examples");
      ctx.exit(1);
    }
  }
}
function isOnline() {
  return dns.lookup("github.com").then(
    () => true,
    () => false
  );
}
async function verifyTemplate(tmpl, ref) {
  const target = getTemplateTarget(tmpl, ref);
  const { repo, subdir, ref: branch } = parseGitURI(target.replace("github:", ""));
  const url = new URL(`/repos/${repo}/contents${subdir}?ref=${branch}`, "https://api.github.com/");
  let res = await fetch(url.toString(), {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  if (res.status === 403) {
    res = await fetch(`https://github.com/${repo}/tree/${branch}${subdir}`);
  }
  return res.status === 200;
}
var GIT_RE = /^(?<repo>[\w.-]+\/[\w.-]+)(?<subdir>[^#]+)?(?<ref>#[\w.-]+)?/;
function parseGitURI(input) {
  const m = input.match(GIT_RE)?.groups;
  if (!m)
    throw new Error(`Unable to parse "${input}"`);
  return {
    repo: m.repo,
    subdir: m.subdir || "/",
    ref: m.ref ? m.ref.slice(1) : "main"
  };
}

// src/index.ts
var exit = () => process.exit(0);
process.on("SIGINT", exit);
process.on("SIGTERM", exit);
async function main() {
  console.log("");
  const cleanArgv = process.argv.slice(2).filter((arg2) => arg2 !== "--");
  const ctx = await getContext(cleanArgv);
  if (ctx.help) {
    help();
    return;
  }
  const steps = [
    verify,
    intro,
    projectName,
    template,
    typescript,
    dependencies,
    // Steps which write to files need to go above git
    git
  ];
  for (const step of steps) {
    await step(ctx);
  }
  console.log("");
  const labels = {
    start: "Project initializing...",
    end: "Project initialized!"
  };
  await tasks(labels, ctx.tasks);
  await next(ctx);
  process.exit(0);
}
export {
  dependencies,
  getContext,
  git,
  intro,
  main,
  next,
  projectName,
  setStdout,
  setupTypeScript,
  template,
  typescript,
  verify
};
