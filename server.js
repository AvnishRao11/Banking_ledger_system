import app from './src/app.js'
import connnectDb from './src/config/DB.js'
import dotenv from 'dotenv'

dotenv.config()

app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`)
})

connnectDb();
