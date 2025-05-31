//import { nanoid } from "nanoid";
import multer, { StorageEngine } from "multer";
 
//import { Request } from "express";

// export const datahost: Record<string, string[]> = {
//   image: ["image/JFIF", "image/jpeg", "image/jpg", "image/webp"],
//   pdf: ["application/pdf"],
//   video: ["video/mp4"],
// };


 export const multerhost=(): multer.Multer =>{

   const storage: StorageEngine = multer.diskStorage({})
    
      const upload = multer({ storage })
      return upload
    }


    
// export const localmulter = (): multer.Multer => {
//   const storage: StorageEngine = multer.diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//       cb(null, 'uploads');
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       cb(null, nanoid(5) + file.originalname);
//     },
//   });

 
//   const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (customvalidation.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('File type not supported'));
//     }
//   };

//   const upload = multer({ storage /*, fileFilter*/ });
//   return upload;
// };
