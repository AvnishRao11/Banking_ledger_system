import mongoose from "mongoose";

const connnectDb = async () => {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('db is connected');
        }).catch(err => {
            console.log("error connecting to db ", err);
            process.exit(1)
        })

}
export default connnectDb;