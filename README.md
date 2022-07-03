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

|      Endpoint      | Method | Description                                                         | POST Method Form Body |
| :----------------: | :----: | :------------------------------------------------------------------ | :-------------------: |
|         /          |  GET   | Get files and directories of shared directory                       |           -           |
|    /get/dirPath    |  GET   | Get files and directories of specific directory in shared directory |           -           |
| /download/filePath |  GET   | Download specific File                                              |           -           |
|      /upload       |  POST  | Upload file to a specfic location                                   |    location, file     |

> `Note`: dirPath, filePath and location should be complete path within the shared directory in base64 format
