import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import axios from "axios";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";

dotenv.config({
  path: "./env",
});
const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

connectDB()
  .then((response) => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Keep-alive ping code
const url = process.env.PRODUCTION_URL;
const interval = 60000; // Ping every 60 seconds

function keepAlive() {
  axios
    .get(url)
    .then((response) => {
      console.log(
        `Pinged at ${new Date().toISOString()}: Status Code ${response.status}`
      );
    })
    .catch((error) => {
      console.error(
        `Error pinging at ${new Date().toISOString()}:`,
        error.message
      );
    });
}

setInterval(keepAlive, interval);
