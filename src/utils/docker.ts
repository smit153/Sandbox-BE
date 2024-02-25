import path from "path";
import Dockerode from "dockerode";
import { FileStructure } from "../types/types";
import {writeLogFile} from "./files";

const docker = new Dockerode();

export async function buildAndRunContainer(
  directory: string,
  port: number,
  structure: FileStructure[]
): Promise<void> {
  const imageName = `sandbox-${port}`;
  let files = [...structure.map((file) => file.filename)];
  files = files.map((filePath) => filePath.substring(5));

  console.log(`Building Docker image from ${directory}`);
  console.log(files);

  try {
    // Build the Docker image
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const imageStream = await docker.buildImage(
      {
        context: directory,
        src: files,
      },
      { t: imageName }
    );

    imageStream.on("data", (chunk) => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      const output = chunk.toString("utf-8");

      console.log(`[${h}:${m}:${s}] `, output.trim());
    });

    await new Promise<void>((resolve, reject) => {
      docker.modem.followProgress(imageStream, (err) => {
        if (err) reject(err);
        else {
          console.log(`Docker image ${imageName} built successfully`);
          resolve();
        }
      });
    });

    // Create container
    console.log(`Creating container from image ${imageName}`);
    const container = await docker.createContainer({
      Image: imageName,
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      ExposedPorts: { "3000/tcp": {} },
      HostConfig: {
        Binds: [`${directory}/src:/app/src`],
        PortBindings: { "3000/tcp": [{ HostPort: `${port}` }] },
      },
      OpenStdin: false,
      StdinOnce: false,
      name: `sandbox-${port}`,
    });

    // Start the container
    console.log(`Starting container for port ${port}`);
    await container.start(function (err, data) {
      if (err) {
        console.error("Error starting container: ", err);
        return;
      }

      console.log("Container started..", data);

      // stream container output (logs)
      container.logs(
        { follow: true, stdout: true, stderr: true },
        (err, stream) => {
          if (err) {
            console.error("Error streaming container logs", err);
            return;
          }
          stream?.on("data", (chunk) => {
            const now = new Date();
            const h = String(now.getUTCHours()).padStart(2, "0");
            const m = String(now.getUTCMinutes()).padStart(2, "0");
            const s = String(now.getUTCSeconds()).padStart(2, "0");
            const output = chunk.toString("utf-8");

            console.log(`[${h}:${m}:${s}] `, output.trim());
            const directory = path.join(
              __dirname,
              "../../",
              "code",
              port.toString(),
              "root",
              "output.txt"
            );
            writeLogFile(directory, `[${h}:${m}:${s}] ${output.trim()}`)
          });
        }
      );
    });

    // Wait for the container to be in a running state
    console.log(
      `Waiting for container for port ${port} to be in a running state...`
    );
    await new Promise<void>((resolve, reject) => {
      container.wait((err: Error) => {
        if (err) reject(err);
        else {
          console.log(`Container for port ${port} started successfully.`);
          resolve();
        }
      });
    });
  } catch (error) {
    console.log("Error", error);
  }
}

// Function to restart a Docker container by name
export async function restartContainerByPort(port: number): Promise<void> {
  // Find container by name (sandbox-<port>)
  const containerName = `sandbox-${port}`;

  // Get container by name
  const container = docker.getContainer(containerName);

  // Restart the container
  await container.restart();
  console.log(`Docker container ${containerName} restarted`);
}

export async function removeContainerAndImageByName(
  containerName: string,
  imageName: string
): Promise<void> {
  // Find container by name
  const container = docker.getContainer(containerName);
  if (container) {
    // Stop the container if it's running
    try {
      await container.stop();
    } catch (error) {
      console.error(`Error stopping container ${containerName}:`, error);
    }

    // Remove the container
    try {
      await container.remove({ force: true });
      console.log(`Container ${containerName} removed successfully.`);
    } catch (error) {
      console.error(`Error removing container ${containerName}:`, error);
    }
  } else {
    console.log(`Container ${containerName} not found.`);
  }

  // Remove image by name
  try {
    await docker.getImage(imageName).remove();
    console.log(`Image ${imageName} removed successfully.`);
  } catch (error) {
    console.error(`Error removing image ${imageName}:`, error);
  }
}
