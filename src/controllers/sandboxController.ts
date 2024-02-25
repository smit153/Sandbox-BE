import path from "path";
import { User } from "../models/users";
import { Sandbox } from "../models/sandbox";
import { validateToken } from "./userController";
import { FileStructure, UserType } from "../types/types";
import {
  executeCode,
  writeFile,
  deleteFile,
  cleanUp,
  getActivePorts,
  getOutputLog
} from "../utils/files";
import {
  FRONTEND_BOILERPLATE,
  BACKEND_BOILERPLATE,
} from "../constants/boilerplate";
import { restartContainerByPort } from "../utils/docker";

const getUserSandbox = async (_parent: unknown, { id }: { id: string }) => {
  try {
    const token = id;
    const user: UserType = await validateToken(_parent, { token });

    const userWithSandbox = await User.findById(user._id).populate("sandbox");

    if (!userWithSandbox) {
      throw new Error("User not found");
    }

    const protectedData = "This is protected data";
    const sandboxes = userWithSandbox.sandbox;

    return { user: userWithSandbox, sandboxes, protectedData };
  } catch (error) {
    throw new Error("Error fetching user sandbox");
  }
};

const createSandbox = async (
  _parent: unknown,
  { name, type, token }: { name: string; type: string; token: string }
) => {
  try {
    const user: UserType = await validateToken(_parent, { token });

    if (!user) {
      throw new Error("User not found");
    }

    if (type !== "react" && type !== "node") {
      throw new Error("Invalid sandbox type");
    }

    const hardcodedCode =
      type === "react" ? FRONTEND_BOILERPLATE : BACKEND_BOILERPLATE;

    const newSandbox = new Sandbox({
      name,
      type,
      codes: hardcodedCode,
    });

    const savedSandbox = await newSandbox.save();

    user.sandbox.push(savedSandbox._id.toString());
    await user.save();
    return savedSandbox;
  } catch (error) {
    throw new Error("error creating sandbox");
  }
};

const deleteSandbox = async (
  _parent: unknown,
  { id, token }: { id: string; token: string }
) => {
  try {
    const user: UserType = await validateToken(_parent, { token });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the sandbox with the provided ID belongs to the user
    const sandboxToDelete = user.sandbox.find(
      (sandboxId) => sandboxId.toString() === id
    );

    if (!sandboxToDelete) {
      throw new Error("Sandbox not found or does not belong to the user");
    }

    // Remove the sandbox ID from the user's sandbox array
    user.sandbox = user.sandbox.filter(
      (sandboxId) => sandboxId.toString() !== id
    );
    await user.save();

    // Delete the sandbox from the Sandbox collection
    await Sandbox.findByIdAndDelete(id);

    return "Sandbox deleted successfully";
  } catch (error) {
    throw new Error("Error deleting sandbox");
  }
};

const getSandbox = async (_parent: unknown, { id }: { id: string }) => {
  try {
    // Find the sandbox by ID in the Sandbox collection
    const sandbox = await Sandbox.findById(id);

    if (!sandbox) {
      throw new Error("Sandbox not found");
    }

    const codes: FileStructure[] = sandbox.codes.map((file) => ({
      filename: file.filename,
      code: file.code || "",
    }));

    const port = await executeCode(codes);

    return { sandbox, port };
  } catch (error) {
    throw new Error("Error fetching sandbox");
  }
};

const updateSandboxCode = async (
  _parent: unknown,
  {
    sandboxId,
    filename,
    code,
    port,
  }: { sandboxId: string; filename: string; code: string; port: number }
) => {
  try {
    const basePath = path.join(
      __dirname,
      "../../",
      "code",
      port.toString(),
      filename
    );
    writeFile(basePath, code);
    restartContainerByPort(port);

    // Find the sandbox by ID
    const sandbox = await Sandbox.findById(sandboxId);
    if (!sandbox) {
      throw new Error("Sandbox not found");
    }

    // Check if the file already exists in the sandbox
    const existingFileIndex = sandbox.codes.findIndex(
      (file) => file.filename === filename
    );

    if (existingFileIndex !== -1) {
      // If the file exists, update its code
      sandbox.codes[existingFileIndex].code = code;
    } else {
      // If the file does not exist, create a new file
      sandbox.codes.push({ filename, code });
    }

    // Save the updated sandbox
    await sandbox.save();

    return "Sandbox code updated successfully";
  } catch (error) {
    throw new Error("Error updating sandbox code");
  }
};

const deleteSandboxFile = async (
  _parent: unknown,
  {
    sandboxId,
    filename,
    port,
  }: { sandboxId: string; filename: string; port: number }
) => {
  try {
    const basePath = path.join(
      __dirname,
      "../../",
      "code",
      port.toString(),
      filename
    );
    deleteFile(basePath);
    restartContainerByPort(port);
    // Find the sandbox by ID
    const sandbox = await Sandbox.findById(sandboxId);

    if (!sandbox) {
      throw new Error("Sandbox not found");
    }

    // Find the index of the file with the given filename
    const fileIndex = sandbox.codes.findIndex(
      (file) => file.filename === filename
    );

    if (fileIndex === -1) {
      throw new Error("File not found in the sandbox");
    }

    // Remove the file from the sandbox
    sandbox.codes.splice(fileIndex, 1);
    // Save the updated sandbox
    await sandbox.save();

    return "File deleted successfully";
  } catch (error) {
    throw new Error("Error deleting file from sandbox");
  }
};

const cleanUpSandbox = async (_parent: unknown, { port }: { port: number }) => {
  try {
    cleanUp(port);
    return "Sandbox cleaned up successfully";
  } catch (error) {
    throw new Error("Error cleaning up sandbox");
  }
};

const getActivePort = async () => {
  const ports = getActivePorts();
  return ports;
};

const getOutput=async(_parent: unknown, { port }: { port: number })=>{
  const output=await getOutputLog(port)
  return output;
}

export {
  getUserSandbox,
  createSandbox,
  deleteSandbox,
  getSandbox,
  updateSandboxCode,
  deleteSandboxFile,
  cleanUpSandbox,
  getActivePort,
  getOutput
};
