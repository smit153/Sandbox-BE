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
} from "../controllers/sandboxController";

const resolvers = {
  Query: {
    getUserSandbox,
    getSandbox,
    getActivePort,
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
