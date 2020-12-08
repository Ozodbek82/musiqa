var storage        = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, path.join(__dirname, PICTURE_FOLDER));
    },
    filename: function(req, file, cb){
      var filename = Date.now();

      switch (file.mimetype) {
        case 'image/png':
        filename = filename + ".png";
        break;
        case 'image/jpeg':
        filename = filename + ".jpeg";
        break;
        default:
        break;
      }
      cb(null, filename);
    }
  });
  var upload       = multer({ storage: storage});
  
  
  app.post('/upload_picture', isLoggedIn, upload.single('file'), function(req, res, next){
      res.render('image', {
        path: req.file.path
      });
  });


  //
  upload(req, res, function (err) {
    if (err) {
          res.json({ error_code: 1, err_desc: err });
          return;
          }
      res.json({ 
          error_code: 0, 
          err_desc: null, 
          file_name: fileString });
    })


//
upload.fields([
    { name: 'header', maxCount: 10 },
    { name: 'subheader', maxCount: 10 },
  ])


  //Я использовал этот маленький трюк, чтобы получить расширение файла, и как обходной путь, чтобы обойти проблемы, которые могут возникнуть, когда кто-то дважды загружает файл с одинаковым именем файла, или который существует на сервере.

  const crypto = require('crypto')
  let upload = multer({
  storage: multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, path.join(__dirname, '../uploads'))
      },
      filename: (req, file, cb) => {
          // randomBytes function will generate a random name
          let customFileName = crypto.randomBytes(18).toString('hex')
          // get file extension from original file name
          let fileExtension = file.originalname.split('.')[1]
          cb(null, customFileName + '.' + fileExtension)
      }
    })
  })