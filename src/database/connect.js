const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://joshirohit092003:aFARbtRrNPgklStv@cluster0.ywlkzxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("database not connected");
  });
