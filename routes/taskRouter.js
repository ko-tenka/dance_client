const express = require('express');
const { Task } = require('../db/models');


const router = require('express').Router()






const multer = require('multer')
const path = require('path');


// const storage = multer.diskStorage({
//     destination:function (req, file, cb) {
//         cb (null, 'images');
//     },
//     filename: function (req, file, cb) {
//         cb(null, `Photo${Date.now()}${path.extname(file.originalname)}`);
//     }
// })









const { v4: uuidv4 } = require('uuid'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
         const uniqueSuffix = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});
const upload = multer({storage:storage})






router.get('/', async (req, res) => {
  // console.log('Зашли в ручку');
  try {
    const allPosts = await Task.findAll();
    // console.log("allPosts:", allPosts)
    res.json(allPosts);
  } catch (error) {
    console.log(error);
    res.json({err: error})
  }
});

// router.post('/', upload.single('img'), async (req, res) => {
//   try {
//     const fileName = req.file.filename;
//     const { title, description, img } = req.body
//     const post = await Task.create({ title, description, img: fileName});
//     res.json(post);
//   } catch (error) {
//     res.json({err: error})
//   }
// });
// router.post('/', upload.single('img'), async (req, res) => {
//   console.log('Заходим в ручку!!!!!!!!!')
//   try {
//     let fileName = null;
//     if (req.files && req.files.length > 0) {
//       fileName = req.files[0].filename;
//     }
//     const { title, description } = req.body;
//     const postData = { 
//       title, 
//       description, 
//       img: fileName 
//     };
//     const post = await Task.create(postData);
//     res.json(post);
//   } catch (error) {
//     res.json({ err: error });
//   }
// });

router.post('/', upload.single('img'), async (req, res) => {
  console.log('Заходим в ручку!!!!!!!!!');
  try {
    let fileName = null;
    if (req.file) {
      fileName = req.file.filename;
    }
    const { title, description } = req.body;
    const postData = {
      title,
      description,
      img: fileName
    };
    const post = await Task.create(postData);
    res.json(post);
  } catch (error) {
    res.json({ err: error });
  }
});




router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await Task.destroy({ where: { id: postId } });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router