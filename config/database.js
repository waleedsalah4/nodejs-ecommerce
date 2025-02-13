import mongoose from "mongoose";

export default function dbConnection() {
  //connect with db
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      // console.log("CONNECTED");
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}
