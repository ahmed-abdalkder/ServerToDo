 
process.env.TZ = 'UTC';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve('config/.env') });
import express from 'express';
import cors from 'cors';
 
import connectDB from './db/connection.DB';
import todorouter from './module/todo/todo.routes';
import userrouter from './module/users/user.routes';
import subrouter from './module/subscriptions/sub.routes';
import notificationScheduler from './notificationScheduler';
 

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
 connectDB();


 

//  Static uploads
app.use('/uploads', express.static('uploads'));

//  Connect DB


//  Scheduler
notificationScheduler.start();

//  Routes
app.use("/api/todos", todorouter);
app.use("/api/users", userrouter);
app.use("/subscriptions", subrouter);

 
 app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is up and running!' });
});
//  Start Server
app.listen(port, () => console.log(` Server listening on port ${port}`));
