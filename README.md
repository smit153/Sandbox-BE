# Node Scaffold Project

## Overview
This Node.js scaffold project provides a foundation for building scalable and maintainable applications. It includes essential configurations and packages to kickstart your development process. Here's a brief overview of the key features and tools used in this project.

## Getting Started
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Use the provided scripts to build, start, and develop your project.

## Scripts
- **Build:** `npm run build` - Transpiles TypeScript code to JavaScript using TypeScript Compiler (`tsc`).
- **Start:** `npm start` - Executes the compiled `index.js` file using Node.js.
- **Development:** `npm run dev` - Utilizes `nodemon` for automatic server restarts during development.
- **Lint:** `npm run lint` - Runs ESLint to ensure code quality and adherence to coding standards.

## Major Packages

### Development Dependencies
- **TypeScript:** `typescript` and related dependencies for type-safe JavaScript development.
- **Nodemon:** `nodemon` for automatic server restarts during development.
- **ESLint:** `eslint` for static code analysis and enforcing coding standards.

### Dependencies
- **Apollo Server:** `@apollo/server` for implementing GraphQL servers.
- **bcryptjs:** `bcryptjs` for hashing and salting passwords securely.
- **jsonwebtoken:** `jsonwebtoken` for handling JWT (JSON Web Tokens) authentication.
- **Mongoose:** `mongoose` and `mongoose-unique-validator` for MongoDB ODM and validation.
- **GraphQL:** `graphql` for building and querying APIs using the GraphQL syntax.
- **Cors:** `cors` for handling Cross-Origin Resource Sharing.
- **dotenv:** `dotenv` for loading environment variables from a .env file.

## Project Structure
- **Source Code:** TypeScript files are in the `src` directory.
- **Configuration:** Configuration files like ESLint and TypeScript configurations are at the project root.
- **Build Output:** The compiled JavaScript files are in the `dist` directory.

Feel free to customize and extend this scaffold to meet the specific requirements of your project. Happy coding!
