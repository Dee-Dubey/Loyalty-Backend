require('dotenv').config();
const { DBNAME, DBUSER, DBPASSWORD, DBHOST, DBDIALECT } = process.env;
const { Sequelize, DataTypes } = require('sequelize');

const fs = require('fs');
const { dataMigration } = require('../../migrations/migration.script');
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

//for postgres connection
const db = new Sequelize(DBNAME, DBUSER, DBPASSWORD, {
    host: DBHOST,
    dialect: DBDIALECT,
    logging: false, 
});

//for sqlite connection
// const db = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database.sqlite'  // Path to your SQLite file
// });

models(db, DataTypes);
db.sync({ alter: true }).then(async(data) => {
    console.log("db synced!");
    await dataMigration(db);
}).catch(e => {
    console.log(e);
});

module.exports = db;