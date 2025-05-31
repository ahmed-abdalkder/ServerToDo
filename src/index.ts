 
process.env.TZ = 'UTC';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve('config/.env') });
import express from 'express';
import cors from 'cors';
import * as i18nextMiddleware from 'i18next-http-middleware';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import connectDB from './db/connection.DB';
import todorouter from './module/todo/todo.routes';
import userrouter from './module/users/user.routes';
import subrouter from './module/subscriptions/sub.routes';
import notificationScheduler from './notificationScheduler';
 

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
 


i18next
  .use(Backend)
  .use((i18nextMiddleware as any).LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/translation.json'),
    },
    detection: {
      order: ['header'],
      caches: false,
    },
    preload: ['en', 'ar'], 
    initImmediate: false,
  });

 
const middlewareHandle = (i18nextMiddleware as any).handle;
app.use(middlewareHandle(i18next));

//  Static uploads
app.use('/uploads', express.static('uploads'));

//  Connect DB
connectDB();

//  Scheduler
notificationScheduler.start();

//  Routes
app.use("/api/todos", todorouter);
app.use("/api/users", userrouter);
app.use("/subscriptions", subrouter);

 
//  Test translation route
app.get('/', (req, res) => {
  const t = (req as any).t;
  res.send({
    message: t('task_reminder_title'),
    language: (req as any).language,
  });
});
 
//  Start Server
app.listen(port, () => console.log(` Server listening on port ${port}`));
