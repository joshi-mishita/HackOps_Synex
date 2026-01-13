// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri =
//   "mongodb+srv://nidhichauhan2460_db_user:8wEnhigj3Klcfow0@cluster0.beyniyu.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true
//   }
// });

// export async function run() {
//   try {
//     // Connect to MongoDB
//     await client.connect();

//     // Ping to confirm connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//   } finally {
//     await client.close();
//   }
// }

// run();
import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://nidhichauhan2460_db_user:8wEnhigj3Klcfow0@cluster0.beyniyu.mongodb.net/?appName=Cluster0";


export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

