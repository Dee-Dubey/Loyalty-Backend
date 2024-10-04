const fs = require('fs');
const express = require('express');
const router = express.Router();
const files = fs.readdirSync(__dirname);

files.forEach(file =>{
    if(file !== 'index.js')
        router.use(`/v1/${file.split('.')[0]}`, require(`./${file}`));
});

module.exports = router;