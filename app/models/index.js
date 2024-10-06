require('dotenv').config();
const { DBNAME, DBUSER, DBPASSWORD, DBHOST, DBDIALECT } = process.env;
const { Sequelize, DataTypes } = require('sequelize');

const fs = require('fs');
const files = fs.readdirSync(`${__dirname}`);
const models = ((sequelize, DataTypes) => {
    files.forEach((file) => {
        if (file !== 'index.js') {
            const importedFile = require(`./${file}`);
            const importedFileName = Object.keys(importedFile)[0];
            sequelize[importedFileName] = importedFile[importedFileName](sequelize, DataTypes);
        }
    })
});



const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'  // Path to your SQLite file
});

models(db, DataTypes);
db.sync({ alter: true }).then((data) => {
    console.log("db synced..");
}).catch(e => {
    console.log(e);
});

module.exports = db;