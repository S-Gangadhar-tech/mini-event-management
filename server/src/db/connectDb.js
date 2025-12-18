import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // 1. Use await to actually wait for the connection
        await mongoose.connect(`${process.env.MONGODB_URL}`);

        // 2. Log the host so you know exactly where you connected (useful for debugging)

    } catch (error) {
        // 3. Handle errors properly

        // 4. Exit the process with failure code (1)
        process.exit(1);
    }
}

export default connectDB;