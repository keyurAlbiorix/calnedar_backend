import mongoose from "mongoose";

mongoose.Promise = global.Promise;
let mongoDb = "mongodb://localhost:27017/athlete";
mongoose.connect(mongoDb, {   useNewUrlParser: true,
  useUnifiedTopology: true
 });
mongoose.connection.on("open", function() {
  console.log("Connection has been established");
});

mongoose.connection.on("error", function() {
  console.log("Error in conecting mongo server");
});

export { mongoose };
