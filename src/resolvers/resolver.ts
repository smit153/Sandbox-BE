import { signup, login } from "../controllers/userController";
import {
  getUserSandbox,
  createSandbox,
  deleteSandbox,
  getSandbox,
  updateSandboxCode,
  deleteSandboxFile,
  cleanUpSandbox,
  getActivePort,
  getOutput
} from "../controllers/sandboxController";

const resolvers = {
  Query: {
    getUserSandbox,
    getSandbox,
    getActivePort,
    getOutput,
  },
  Mutation: {
    signup,
    login,
    createSandbox,
    deleteSandbox,
    updateSandboxCode,
    deleteSandboxFile,
    cleanUpSandbox,
  },
};

export { resolvers };
