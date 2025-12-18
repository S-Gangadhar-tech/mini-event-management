import app from "./src/server.js"
import { configDotenv } from "dotenv";
import connectDB from "./src/db/connectDb.js";

configDotenv.apply("/")

try {
    await connectDB().then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Server listening on port " + `${process.env.PORT}`);

        })
    })
} catch (error) {
    console.log(error.getMessage());

}

