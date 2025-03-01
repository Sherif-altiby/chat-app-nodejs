import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectMongo = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB ${connectMongo.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};


