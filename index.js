const express = require('express')
const config = require('config')
var cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
const PORT = config.get('port') || 5000

app.use(cors())


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', require('./routers/auth.route') )
app.use('/api', require('./routers/systems.route') )
app.use('/api/uploads', require('./routers/schemes.route') )


async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log('Сервер запущен на ' + PORT))
    }
    catch (e) {
        console.log('Server Error',e.message)
        process.exit(1)
    }
}


start()

