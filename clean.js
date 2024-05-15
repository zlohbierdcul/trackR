import fs from "fs";

/**
 * @param {fs.PathLike} path
 */
function deleteFolderRecursive(path) {
  try {
    console.log(path)
    fs.rmSync(path, { recursive: true, force: true })
    console.log(`Deleted ${path}`)
    fs.mkdirSync(path)
  } catch (_) {
    console.log("Folder does not exist.")
  }
}

console.log("Cleaning working tree...");

// @ts-ignore
deleteFolderRecursive(process.argv[process.argv.length - 1]);

console.log("Successfully cleaned working tree!");