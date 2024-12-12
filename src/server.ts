import express from 'express'
import {config} from 'dotenv'

config()
const app = express()
const port = process.env.PORT || 8000

app.get('/', (_, res) => {
    res.json('Hello World!')
})
app.listen(port, () => console.log(`listening on port ${port}}`))