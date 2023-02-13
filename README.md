# arrow-website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.


### Requirements

The site is built through `node` and `npm` (included in Node.js), and the minimum version required for it to work is:

```
"node": ">=16.14"
```

You can check your version by going to your terminal and performing:

```
node -v
```

Depending on your OS and your OS apps/package managers, you could find different methods of having the proper `node` version installed. Please visit the [Node.js website](https://nodejs.org) to see the [best way for you](https://nodejs.org/en/download/) to have it available in your system.

We recommend the use of a tool like [NVM](https://github.com/nvm-sh/nvm) which could ease the installation, and will also allow you to have different `node` versions coexisting in your system in case you need it. Using a LTS Node.js version is recommended.


### Installation

```
$ npm install
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true npm run deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
