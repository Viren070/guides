# Guides

This website contains guides on using various apps that I have found useful and it is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. The search bar is also powered by [DocSearch x Algolia](https://docsearch.algolia.com/)

If you want to contribute, see [Contributing](#contributing)

## Prerequisites

Before you can run or contribute to this project, you need to have Node.js and npm installed on your machine.

### Installing Node.js and npm

1. **Download Node.js**: Go to the [official Node.js website](https://nodejs.org/) and download the installer for your operating system. This will also install npm, so you don't need to install it separately.
2. **Verify Installation**: Open your terminal or command prompt and run the following commands to check that Node.js and npm are installed correctly.
   ```sh
   node --version
   npm --version
    ```

### Setting up the project 

After installing Node.js and npm, you can set up the project on your local machine. 

1. **Clone the repository:** First, clone the repisitory to your local machine using the following command: 
    ```
    git clone https://github.com/Viren070/guides.git 
    ```
2. **Navigate to the directory that contains the repository**
    ```
    cd guides 
    ```
3. **Install dependencies**: Install all the necessary dependencies by running: 
    ```
    npm install
    ```
## Local development 

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

To generate static content into the `build` directory, which can be served using any static contents hosting service, run:
```
$ npm run build
```

## Contributing 

If you wish to contribute or make changes to a specific page, fork the repository, locate the page within the `docs` folder, make your changes, and create a pull request.
