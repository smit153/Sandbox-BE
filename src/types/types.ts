import { Document } from "mongoose";


export interface codeSchema extends Document {
  filename: string;
  code: string;
}

export interface SandboxType extends Document {
  _id: string;
  name: string;
  type: string;
  code: codeSchema[];
}

export interface UserType extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  sandbox: string[];
}

export interface FileStructure {
  filename: string;
  code: string;
}

export interface ImageBuildResponseItem {
  stream?: string;
}

export interface ContainerWaitData {
  StatusCode: number;
}