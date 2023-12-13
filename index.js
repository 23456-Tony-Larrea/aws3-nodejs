import express from 'express'
import fileUpload from 'express-fileupload'
import { uploadFile, getFiles,downloadFile, getFileURL } from './s3.js'
//cors
import cors from 'cors'

const app = express()

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))
app.use(cors())


app.get('/files', async (req, res) => {
    const result = await getFiles()
    res.json(result.Contents)
})

app.get('/files/:fileName', async (req, res) => {
    const result = await getFileURL(req.params.fileName)
    res.json({
        url: result
    })
})

app.get('/downloadfile/:fileName', async (req, res) => {
    await downloadFile(req.params.fileName)
    res.json({message: "archivo descargado"})
})


app.post('/files', async (req, res) => {
    const result = await uploadFile(req.files.file)
    res.json({ result })
})

app.use(express.static('images'))
app.listen(3001)
console.log(`Server on port ${3001}`)