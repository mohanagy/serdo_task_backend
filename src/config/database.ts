import mongoose from "mongoose";

export const initDatabase = async (url: string) => {
  try {
    await mongoose.connect(url);
    const database = mongoose.connection;
    database.on("error", (error) => {
      console.error(error);
      process.exit(1);
    });

    console.log("Database connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default initDatabase;
