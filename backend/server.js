// import express from "express";
// import mongoose from "mongoose";
// import dotenv from 'dotenv'
// import userRoutes from './Routes/userRoutes.js'
// import blogRoutes from './Routes/blogRoutes.js'
// import adminRoutes from './Routes/adminRoutes.js'
// import cors from 'cors'
// import cookieParser from "cookie-parser";

// dotenv.config()
// const app = express();
// app.use(cookieParser())
// app.use(cors({
//   origin : ["http://localhost:5173", "http://localhost:5174" ],
//   credentials : true
// }))
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));


// app.use('/api/user', userRoutes)
// app.use('/api/blog', blogRoutes )
// app.use('/api/admin', adminRoutes )

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(3000, () => {
//       console.log(`Server running at http://localhost:3000`)
//       console.log("DB Connected");      
//     });
//   })
//   .catch(err => console.log(err));







import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    httpServer.listen(3000, () => {
      console.log(`Server running at http://localhost:3000`);
      console.log("DB Connected");
    });
  })
  .catch((err) => console.log(err));


io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  socket.on("chatMessage", (data) => {
    const messageData = {
      user: data.user || "Anonymous",
      text: data.text,
      time: new Date().toLocaleTimeString(),
    };

    io.emit("chatMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

