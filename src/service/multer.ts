// This component configures and exports a multer instance for handling file uploads.
// It currently uses disk storage with default settings (no specific destination or filename logic).

import multer, { StorageEngine } from "multer";
// Import multer middleware and the StorageEngine type for configuring file storage

export const multerhost = (): multer.Multer => {
  // Configure multer to use disk storage with default options
  const storage: StorageEngine = multer.diskStorage({});
  
  const upload = multer({ storage });
  return upload; // Return the configured multer instance
};

// The following commented code provides an alternative local multer configuration,
// where the upload destination and filename are explicitly defined,
// along with a commented-out fileFilter for validating allowed mimetypes.

// export const localmulter = (): multer.Multer => {
//   const storage: StorageEngine = multer.diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//       cb(null, 'uploads');
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       cb(null,   file.originalname);
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

