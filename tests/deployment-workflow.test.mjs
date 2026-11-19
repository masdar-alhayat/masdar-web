import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {test} from "node:test";
import {createRequire} from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");
const workflow = yaml.load(fs.readFileSync(new URL("../.github/workflows/main.yml", import.meta.url), "utf8"));
const deploy = workflow.jobs.deploy.steps.find(step => step.name === "Deploy").run;
const remote = deploy.split("<< 'REMOTE_SCRIPT'\n")[1].split("\nREMOTE_SCRIPT")[0];
const bash = process.platform === "win32" ? "C:/Program Files/Git/bin/bash.exe" : "bash";

// Run the actual remote workflow script. Replace external services and the build
// with local fixtures; directory moves, link resolution and rollback are real.
const mocks = String.raw`
git() {
  if [ "$1" = clone ]; then
    local dest="${'${@: -1}'}"
    mkdir -p "$dest/public" "$dest/node_modules/next/dist/bin"
    touch "$dest/node_modules/next/dist/bin/next"
  else
    printf '%s\n' test-commit
  fi
}
npm() {
  if [ "$1" = run ]; then
    if [ "$TEST_MODE" = build-failure ]; then return 1; fi
    mkdir -p .next/static
    printf '%s\n' build > .next/BUILD_ID
  fi
}
pm2() {
  printf '%s\n' "$*" >> "$TEST_PM2_LOG"
  if [ "$1" = start ]; then
    local executable="$2"
    case "$executable" in */node_modules/next/dist/bin/next) ;; *) return 9;; esac
    local release="${'${executable%/node_modules/next/dist/bin/next}'}"
    test -s "$release/.next/BUILD_ID" || return 9
    case " $* " in *" --cwd $release "*) ;; *) return 9;; esac
    case " $* " in *" -- start $release "*) ;; *) return 9;; esac
    case " $* " in *" --hostname 0.0.0.0 "*) ;; *) return 9;; esac
  fi
}
node() { cat > /dev/null; test "$TEST_MODE" != health-failure; }
sleep() { :; }
date() { printf '%s\n' 2030-01-01_00-00-00; }
`;

// Windows requires elevated privileges for POSIX symlinks. Junctions provide
// real directory links for these tests; production/Linux uses the actual ln.
const windowsLinkAdapter = String.raw`
ln() {
  "$TEST_NODE" "$TEST_LINK_HELPER" "$(cygpath -w "${'${@: -2:1}'}")" "$(cygpath -w "${'${@: -1}'}")"
}
`;

for (const scenario of [
  {name: "migrates a real current directory and preserves its contents", layout: "directory", mode: "success"},
  {name: "replaces an existing current symlink", layout: "symlink", mode: "success"},
  {name: "creates current for the first deployment", layout: "missing", mode: "success"},
  {name: "restores a legacy directory after a failed health check", layout: "directory", mode: "health-failure"},
  {name: "restores the previous symlink after a failed health check", layout: "symlink", mode: "health-failure"},
  {name: "leaves current and PM2 untouched if the build fails", layout: "directory", mode: "build-failure"},
]) {
  test(scenario.name, () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "masdar-deploy-test-"));
    try {
      const base = path.join(fixture, "staging");
      const current = path.join(base, "current");
      const previous = path.join(base, "releases", "previous");
      const release = path.join(base, "releases", "2030-01-01_00-00-00");
      const backup = path.join(base, "current-backup-2030-01-01_00-00-00");
      const pm2Log = path.join(fixture, "pm2.log");
      fs.mkdirSync(base, {recursive: true});
      const oldPath = scenario.layout === "symlink" ? previous : current;
      if (scenario.layout !== "missing") {
        fs.mkdirSync(path.join(oldPath, ".next", "static"), {recursive: true});
        fs.mkdirSync(path.join(oldPath, "node_modules", "next", "dist", "bin"), {recursive: true});
        fs.writeFileSync(path.join(oldPath, ".next", "BUILD_ID"), "previous-build");
        fs.writeFileSync(path.join(oldPath, "node_modules", "next", "dist", "bin", "next"), "");
        fs.writeFileSync(path.join(oldPath, "preserve.txt"), "legacy content");
      }
      if (scenario.layout === "symlink") fs.symlinkSync(previous, current, "junction");
      const linkHelper = path.join(fixture, "link.cjs");
      fs.writeFileSync(linkHelper, `
        const fs = require('fs');
        const [target, link] = process.argv.slice(2);
        try {
          const stat = fs.lstatSync(link);
          if (!stat.isSymbolicLink()) throw new Error('ln -T refuses an existing directory');
          fs.unlinkSync(link);
        } catch (error) { if (error.code !== 'ENOENT') throw error; }
        fs.symlinkSync(target, link, 'junction');
      `);
      const script = path.join(fixture, "deploy.sh");
      fs.writeFileSync(script, mocks + (process.platform === "win32" ? windowsLinkAdapter : "") + remote);
      const result = spawnSync(bash, [script, base, "test-app", "3001", "staging"], {
        encoding: "utf8", timeout: 30000,
        env: {...process.env, TEST_MODE: scenario.mode, TEST_PM2_LOG: pm2Log,
          TEST_NODE: process.execPath, TEST_LINK_HELPER: linkHelper},
      });
      const output = `${result.stdout}\n${result.stderr}`;
      assert.equal(result.status, scenario.mode === "success" ? 0 : 1, output);
      if (scenario.mode === "success") {
        assert.equal(fs.realpathSync(current), fs.realpathSync(release), output);
        assert.ok(fs.lstatSync(current).isSymbolicLink());
        if (scenario.layout === "directory") assert.equal(fs.readFileSync(path.join(backup, "preserve.txt"), "utf8"), "legacy content");
      } else {
        assert.equal(fs.readFileSync(path.join(current, "preserve.txt"), "utf8"), "legacy content", output);
        assert.equal(fs.lstatSync(current).isSymbolicLink(), scenario.layout === "symlink", output);
        if (scenario.mode === "build-failure") assert.ok(!fs.existsSync(pm2Log), output);
      }
    } finally {
      // Only remove this test's freshly allocated temporary directory.
      assert.equal(path.dirname(fixture), os.tmpdir());
      const current = path.join(fixture, "staging", "current");
      if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) fs.unlinkSync(current);
      fs.rmSync(fixture, {recursive: true, force: true});
    }
  });
}
