require("dotenv").config()
const express = require("express")
const fs = require('fs')
const nunjucks = require('nunjucks')
const path = require('path')
const upload = require('express-fileupload')

// express configurations
const shareDirPath = process.env.SHARE_DIR || __dirname
const PORT = process.env.PORT || 3000
const platform = process.platform

const app = express()

// nunjucks configurations
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    watch: true
});

// configure middlewares
app.use(upload())
app.use('/static', express.static(path.join(__dirname, 'static')))
app.disable('x-powered-by')

// API Routes
app.route('/api/get').get(getDirList)
app.route('/api/get/:dirPath').get(getDirList)
app.route('/api/download/:filePath').get(handleDownload)
app.route('/api/upload').post(handleUploadFile)

// website routes
app.route('/').get(home)
app.route('/open').get(home)
app.route('/open/:path').get(home)

// API functions
async function getDirList(req, res) {
    // get directory path from url 
    let dirPath = req.params.dirPath

    // if dirpath is not defined then use default storage 
    if (dirPath == undefined) {
        dirPath = shareDirPath
    } else {
        // convert base64 to utf-8
        dirPath = Buffer.from(dirPath, 'base64').toString('utf-8')

        // check if directory data asked if part of share directory
        const dirChunk = dirPath.split(shareDirPath)[1]

        // if directory chunk is undefined then base directory is different
        // unauthorized access
        if (dirChunk == undefined) {
            res.status(404).json({ "error": "invalid directory" })
            return
        }

        dirPath = path.join(shareDirPath, dirChunk)
    }

    let dirData = {
        'pathType': platform,
        'shareDir': shareDirPath,
        'dir': dirPath,
        'dirs': [],
        'files': [],
        'error': false
    }

    fs.readdir(dirPath, (err, files) => {
        // if error is raised, then directory is not valid
        if (err) {
            dirData["error"] = err
            res.status(404).json({ "error": "invalid directory" })
            return
        }

        // map directory files and folders into dirData variable
        files.forEach(file => {
            let fileDetails = fs.lstatSync(path.resolve(dirPath, file));

            if (fileDetails.isDirectory()) {
                dirData["dirs"].push(file)
            } else {
                dirData["files"].push(file)
            }

        });

        // send response
        res.json(dirData)
    });
}

async function handleDownload(req, res) {

    // get directory path from url 
    let filePath = req.params.filePath

    // if dirpath is not defined then use default storage 
    if (filePath == undefined) {
        res.status(400).json({ "error": "file path parameter required" })
        return
    } else {
        // convert base64 to utf-8
        filePath = Buffer.from(filePath, 'base64').toString('utf-8');

        // check if directory data asked if part of share directory
        const fileChunk = filePath.split(shareDirPath)[1]

        // if directory chunk is undefined then base directory is different
        // unauthorized access
        if (fileChunk == undefined) {
            res.status(401).json({ "err": "unauthorized access" })
            return
        }

        // join file path
        filePath = path.join(shareDirPath, fileChunk)
    }

    // send file
    const fileName = path.parse(filePath).base
    res.download(filePath, fileName)
}

async function handleUploadFile(req, res, next) {
    // check for file
    let file = null
    let location = null
    try {
        file = req.files.file
        location = req.body.location
    } catch (TypeError) {
        res.status(400).json({ 'error': 'file and location required' })
        return
    }

    // verify variables
    if (location != undefined) {
        location = Buffer.from(location, 'base64').toString('utf-8')

        // check if directory data asked is part of shared directory
        const filePathChunk = location.split(shareDirPath)[1]

        // if directory chunk is undefined then base directory is different
        // unauthorized access
        if (filePathChunk == undefined) {
            res.status(401).json({ "err": "unauthorized access" })
            return
        }

        // join file path
        location = path.join(shareDirPath, filePathChunk)

    } else {
        res.status(400).json({ 'error': 'location required' })
        return
    }

    // create directories if it doesn't exist
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location, { recursive: true });
    }

    // move file
    const filePath = path.join(location, file.name)
    file.mv(filePath, (error) => {
        if (error) {
            res.status(500).json({ 'error': 'cannot save uploaded file' })
            return
        }
        res.json({ 'status': 'uploaded' })
    })

}


// APP functions
async function home(req, res) {
    let dirPath = req.params.path

    // if parameter is not passed load home shared directory
    if (dirPath == undefined) {
        dirPath = ''
    }

    // get title
    if (platform == 'win32' && dirPath != ''){
        title = Buffer.from(dirPath,'base64').toString('utf-8').split('\\')
        title = title[title.length - 1]
    } else {
        title = 'WebDirShare'
    }
    
    res.render('index.html', {
        'title': title,
        'currDir': dirPath
    })
}

app.listen(PORT, () => {
    console.log('[*] Application Started on PORT:', PORT)
    console.log('[*] Sharing Directory:', shareDirPath)
})