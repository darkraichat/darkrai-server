# Darkrai Server

The server component for the Darkrai browser extension.

You can find the repository for the extension [here.](https://github.com/statebait/darkrai-extension)

> Darkrai is a browser extension which enables you to chat with anybody visiting the same website 🤩

## Development

Darkrai uses a docker container configuration for both development (using vscode) and production. Hence we recommend you install docker. Learn more [here](https://www.docker.com/get-started).

### Environment file

You need to setup a `.env` file in the root of the repository. The file should look like this:

```bash
DB_URL = #Your database url here
DB_NAME = #Your database name here
NODE_ENV = #Your node environment mode (development or production)
```

### Docker

- To develop in docker with vscode you need to have the [Remote-Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed.
- After installing the extension open the command palette and select the "Open folder in Container" option which will open your folder in the docker container.
- Once the image is built and your vscode window is open in the container, open a terminal (in vscode) and run `yarn dev` and you are good to go.

### Regular

You need the following dependencies installed on your machine:

- NodeJS
- Yarn

Run the following commands in the cloned repository:

```bash
# To install node dependencies
yarn
# To run the dev server
yarn dev
```

## Production

For production, we highly recommend using docker, however if you want to run the server without docker than you will need to install the dependencies mentioned in [this](#Regular) section and then just run `yarn start` in the repo folder.

For docker users:

- First, build the image:

  ```bash
  docker build -t darkrai .
  ```

- Run the image while mapping the port to the host machine:

  ```bash
  docker run -p 4848 darkrai
  ```
