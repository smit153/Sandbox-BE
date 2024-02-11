import fs from "fs";
import path from "path";
import portfinder from "portfinder";
import { FileStructure } from "../types/types";
import { buildAndRunContainer,removeContainerAndImageByName } from "./docker";

portfinder.setBasePort(8000); // default: 8000
portfinder.setHighestPort(10000); // default: 65535
const activePorts: number[] = [];

export function writeToFolder(
  structure: FileStructure[],
  basePath: string
): void {
  structure.forEach((file) => {
    const filePath = path.join(basePath, file.filename);
    const directoryPath = path.dirname(filePath);

    // Create directories if they don't exist
    fs.mkdirSync(directoryPath, { recursive: true });

    // Write file
    fs.writeFileSync(filePath, file.code);
  });
}

export function writeFile(filePath: string, content: string): void {
  // Create directories if they don't exist
  const directoryPath = path.dirname(filePath);
  fs.mkdirSync(directoryPath, { recursive: true });

  // Write file
  fs.writeFileSync(filePath, content);
}

export function deleteFile(filePath: string): void {
  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Delete file
    fs.unlinkSync(filePath);
  }
}

export async function executeCode(structure: FileStructure[]): Promise<number> {
  const port = await findPort();
  writeToFolder(structure, `code/${port}`);
  const directory = path.join(
    __dirname,
    "../../",
    "code",
    port.toString(),
    "root"
  );
  await buildAndRunContainer(directory, port, structure);
  return port;
}

async function findPort(): Promise<number> {
  let port = await portfinder.getPortPromise();

  if (activePorts.includes(port)) {
    port = Math.max(...activePorts) + 1;
    activePorts.push(port);
  } else {
    activePorts.push(port);
  }
  return port;
}

function deleteFolderRecursive(folderPath:string) {
  if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach(file => {
          const curPath = path.join(folderPath, file);
          if (fs.lstatSync(curPath).isDirectory()) { // Recursively delete subdirectories
              deleteFolderRecursive(curPath);
          } else { // Delete files
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(folderPath); // Finally, delete the directory itself
  } else {
      console.log(`Folder ${folderPath} does not exist.`);
  }
}

export async function cleanUp(port: number): Promise<void> {
  const directory = path.join(__dirname, "../../", "code", port.toString());
  deleteFolderRecursive(directory);

  await removeContainerAndImageByName(`sandbox-${port}`,`sandbox-${port}`);
  activePorts.splice(activePorts.indexOf(port), 1);
}

export function getActivePorts(): number[] {
  return activePorts;
}
