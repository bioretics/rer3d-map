const fs = require("fs");
const path = require("path");

const argv = require("minimist")(process.argv.slice(2));

const projectRoot = process.cwd();
const srcDir = path.resolve(projectRoot, argv.src || "wwwroot/images/maki");
const destDir = path.resolve(
  projectRoot,
  argv.dest ||
    path.join(
      "wwwroot",
      "build",
      "TerriaJS",
      "build",
      "Cesium",
      "build",
      "Assets",
      "Textures",
      "maki"
    )
);
const force = !!argv.force;

function ensureDirSync(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function copyFileSyncOverwrite(src, dest) {
  if (!fs.existsSync(src)) return false;
  if (fs.existsSync(dest) && !force) {
    return false;
  }
  fs.copyFileSync(src, dest);
  return true;
}

(async function main() {
  try {
    if (!fs.existsSync(srcDir)) {
      process.exit(2);
    }

    ensureDirSync(destDir);

    const entries = fs.readdirSync(srcDir);
    const pngs = entries.filter((f) => /\.png$/i.test(f));
    if (pngs.length === 0) {
      process.exit(0);
    }

    let copied = 0;
    for (const file of pngs) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);

      try {
        const ok = copyFileSyncOverwrite(srcPath, destPath);
        if (ok) {
          copied++;
        }
      } catch (err) {
        console.error(err.message || err);
      }
    }

    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
})();
