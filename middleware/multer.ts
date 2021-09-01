const util = require("util");
// const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
import { Request } from 'express';
import multer from 'multer';
type File = Express.Multer.File;
var sftpStorage = require('multer-sftp')

// var storage = sftpStorage({
//   sftp: {
//     host: '104.236.35.213',
//     port: 22,
//     username: 'root',
//     password: 'Albiorix@123456Tech'
//   },

//   destination: function (req: Request, file: File, callback: (error: Error | null, destination: string) => void) {
//     callback(null, '/athlete/upload/');
//   },
//   onError : function(err:any, next:any) {
//     console.log('error', err);
//     next(err);
//   },

//   filename: function (req: Request, file: File, callback: (error: Error | null, destination: string) => void) {
//     console.log("file.originalname", file.originalname)
//     callback(null, file.originalname + '-' + Date.now());
//   }
// })

var storage = multer.diskStorage({
  destination: function (req: Request, file: File, callback: (error: Error | null, destination: string) => void) {
    callback(null, './uploads');

  },

  filename: function (req: Request, file: File, callback: (error: Error | null, destination: string) => void) {
    console.log("file.originalname", file.originalname )
    callback(null, file.originalname );
  }
});

let uploadFile = multer({
  storage: storage,
});
// var uploadMultiple = uploadFile.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }])

module.exports = { uploadFile }
