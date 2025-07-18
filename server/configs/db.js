import mongoose, { connect } from 'mongoose'
// for connecting mongoDb

const connectDB=async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log('DataBase connected');
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/ai_blog`)    //MONGODB_URI in .env file
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB