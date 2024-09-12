const express = require('express');
const { Task } = require('../db/models');
const multer = require('multer')
const path = require('path');

const router = require('express').Router()

const storage = multer.diskStorage({
    destination:function (req, file, cb) {
        cb (null, 'public/');
    },
    filename: function (req, file, cb) {
        cb(null, `Photo${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage:storage})

router.post('/main', upload.single('img'), async (req, res) => {
    try {
        const fileName = req.file.filename;
        console.log('ЧТО ЭТО ТАКОЕ?', fileName)

        await Task.create({
            img: fileName, 
        });
     res.status(200)
     .json({msg:'Файл загружен', newFileName: req.file.filename})
      
    } catch (error) {
      res.json({err: error})
      console.log('Файл пошел по одному месту')
    }
  });
module.exports = router;
