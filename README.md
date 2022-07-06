# WebDirShareAPI

WebDirShareAPI is written in node.js using express which helps to download/upload files to the specified directory only

## Installation

- Clone/Download repository

  ```bash
  git clone --depth=1 https://github.com/dmdhrumilmistry/WebDirShareAPI/
  ```

- Change Directory

  ```bash
  cd WebDirShareAPI
  ```

- Install dependencies

  ```bash
  npm install
  ```

- Create .env file containing API configuration

  ```bash
  SHARE_DIR=ShareDirectoryPATH # set directory path
  PORT=3000 # set api port
  ```

- Start API

  ```bash
  npm run app
  ```

## Endpoints

|        Endpoint        | Method | Description                                                         | POST Method Form Body |
| :--------------------: | :----: | :------------------------------------------------------------------ | :-------------------: |
|    /api/get/dirPath    |  GET   | Get files and directories of specific directory in shared directory |           -           |
| /api/download/filePath |  GET   | Download specific File                                              |           -           |
|      /api/upload       |  POST  | Upload file to a specfic location                                   |    location, file     |

> `Note`: dirPath, filePath and location should be complete path within the shared directory in base64 format

## Dockerize Project

### Build

- using docker build project

  ```bash
  docker build . -t <app-name>
  ```

- Start Application

  ```bash
  docker run -p <localport>:<container-port> -d <app-name>
  # outputs container id
  <container-id>
  ```

  > Default container port : 80  
  > Application can be acccessed from http://127.0.0.1:[local-port]/

### Pull Docker Image

- Pull Image

  ```bash
  docker pull dmdhrumilmistry/webdirshare
  ```

- Start Application

  ```bash
  docker run -p <localport>:80 -d <app-name>
  # outputs container id
  <container-id>
  ```

  > Application can be acccessed from http://127.0.0.1:[local-port]/

### Managing Files manually

- Get bash shell of the container

  ```bash
  docker  exec -it <container-id> "bash"
  ```

## Stop and Delete Container Data

- Stop Service

  ```bash
  docker kill <container-id>
  ```

- remove container

  ```bash
  docker rm <container-id>
  ```

## TODO

- [ ] Implement Search in API and UI
