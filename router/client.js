const express = require('express');
const { auth, isAdmin } = require('../app/middlewares');
const { getAllClient, createClient, deleteClient } = require('../app/controllers/client.controller');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + req.body.name+".png");
    }
});
  
const upload = multer({ storage: storage });

router
.route('/')
.get(getAllClient)
.post(upload.single('image'), createClient);

router
.route('/:id')
.delete(deleteClient);

module.exports = router;