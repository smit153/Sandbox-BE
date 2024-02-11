export const BACKEND_BOILERPLATE = [
  {
    filename: "root/index.js",
    code: `const express = require("express");
    const usersRouter = require("./routes/users");
    const app = express();
    const port = 3000;
    
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    
    app.use("/users", usersRouter);
    
    app.listen(port, () => {
      console.log("Example app listening on port"+port);
    });
    `,
  },
  {
    filename: "root/package.json",
    code: `
    {
        "name": "templateforv2-static",
        "version": "1.0.0",
        "description": "",
        "main": "index.html",
        "scripts": {
          "start": "nodemon index.js",
          "build": "echo This is a static template, there is no bundler or bundling involved!"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/codesandbox-app/static-template.git"
        },
        "keywords": [],
        "author": "Ives van Hoorne",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/codesandbox-app/static-template/issues"
        },
        "homepage": "https://github.com/codesandbox-app/static-template#readme",
        "dependencies": {
          "express": "^4.18.2",
          "nodemon": "^2.0.20"
        }
      }
      `,
  },
  {
    filename: "root/routes/users.js",
    code: `const express = require("express");
    const router = express.Router();
    
    /* GET users listing. */
    router.get("/", function (req, res, next) {
      res.send("respond with a resource");
    });
    
    module.exports = router;
    `,
  },
  {
    filename: "root/Dockerfile",
    code: `
    # Use an official Node.js runtime as the base image
    FROM node:alpine
    
    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json to the working directory
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the application code
    COPY . .
    
    # Expose the port that the backend will run on
    EXPOSE 4000
    
    # Start the backend application
    CMD ["npm","start"]
    `,
  },
];

export const FRONTEND_BOILERPLATE = [
  {
    filename: "root/public/index.html",
    code: `
        <!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="theme-color" content="#000000">
	<!--
      manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
    -->
	<link rel="manifest" href="%PUBLIC_URL%/manifest.json">
	<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
	
	<title>React App</title>
    </head>

    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
        
    </body>

    </html>`,
  },
  {
    filename: "root/src/App.js",
    code: `import "./styles.css";

    export default function App() {
      return (
        <div className="App">
          <h1>Hello Sandbox</h1>
          <h2>Start editing to see some magic happen!</h2>
        </div>
      );
    }
    `,
  },
  {
    filename: "root/src/index.js",
    code: `
    import { StrictMode } from "react";
    import { createRoot } from "react-dom/client";

    import App from "./App";

    const rootElement = document.getElementById("root");
    const root = createRoot(rootElement);

    root.render(
    <StrictMode>
        <App />
    </StrictMode>
    );
    `,
  },
  {
    filename: "root/src/styles.css",
    code: `.App {
        font-family: sans-serif;
        text-align: center;
      }
      `,
  },
  {
    filename: "root/package.json",
    code: `{
            "name": "react",
            "version": "1.0.0",
            "description": "React example starter project",
            "keywords": ["react", "starter"],
            "main": "src/index.js",
            "dependencies": {
              "loader-utils": "3.2.1",
              "react": "18.2.0",
              "react-dom": "18.2.0",
              "react-scripts": "5.0.1",
              "@babel/runtime": "7.13.8",
              "babel-eslint": "^10.1.0",
              "eslint": "^7.2.0",
              "eslint-plugin-react": "^7.20.6",
              "eslint-plugin-react-hooks": "^4.0.0",
              "eslint-plugin-react-refresh": "^0.4.4",
              "typescript": "4.1.3"
            },
            "scripts": {
              "start": "react-scripts start",
              "build": "react-scripts build",
              "test": "react-scripts test --env=jsdom",
              "eject": "react-scripts eject"
            },
            "browserslist": [">0.2%", "not dead", "not ie <= 11", "not op_mini all"]
          }
          `,
  },
  {
    filename: "root/Dockerfile",
    code: `# Use an official Node.js runtime as the base image
    FROM node:alpine
    
    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json to the working directory
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the application code
    COPY . .
    
    # Expose the port that the backend will run on
    EXPOSE 3000
    
    # Start the backend application
    CMD ["npm","start"]
    `,
  },
];
