const express = require("express");
const mysql = require("mysql");
const Joi = require("joi");
const bodyParser = require("body-parser");

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "courses"
});

db.connect((err)=>{
    if(err) throw err;
    console.log("MySql Connected. .."); 
});

app.use(bodyParser.json());
/* ********************************** Create DB********************************** */

app.get("/dbcreated", (req, res)=>{
    let sql = "CREATE DATABASE firstNodeDB";
    db.query(sql, (err, result)=>{
        console.log("before throw error");
        if(err) throw err;
        res.send("database created. ..");
    });
});

/* ******************************** Create Table ********************************** */

app.get('/createRecipeTable',(req, res)=>{
    let sql = "CREATE TABLE allrecipe(id int AUTO_INCREMENT, recipe VARCHAR(255), price int, PRIMARY KEY(id));"
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send("Table created...");
    })
});

/* ******************************** Insert row ************************************* */

app.post('/recipe', (req, res)=>{
    
    let { error } = validation(req.body);
    let sql = `INSERT INTO allrecipe (recipe, price) VALUES ('${req.body.recipe}', '${req.body.price}')`;
    if(error) return res.status(400).send("wrong Data request");

    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send("data inserted into recipe table");
    });
});

/* ******************************** Update field or attribute ***************************** */

app.put('/recipe/:id', (req, res)=>{
    console.log(req.body.recipe);
    let error = (typeof req.body.recipe === String && req.body.recipe.length >= 3)? true : false;
    const sql = `UPDATE allrecipe SET recipe = '${req.body.recipe}' WHERE id = ${req.params.id}`;
    if(error) throw "recipe must be a String type and length must be greater or equal 3";

    db.query(sql, (err, result)=>{
        if(err) throw err;

        console.log(result);
        res.end("recipe updated . ...")
    });

});

/* ************************************ Delete row ********************************************* */
app.delete("/recipe/:id", (req, res)=>{
    console.log("delete request comes ahead");
    const { id } = req.params;
    const seeData = `SELECT * FROM allrecipe WHERE id = ${id}`;
    const deletQuery = `DELETE FROM allrecipe WHERE id = ${id}`;
    db.query(seeData, (err, result)=>{
        if(err) throw err;
        db.query(deletQuery, (err, result)=>{
            if(err) throw err;
            console.log(result);
            res.end("Row deleted . ...");
        });
    });
});

/* ************************************ Fetch All Recipe **************************************** */

app.get("/recipe", (req, res)=>{
    let sql = "SELECT * FROM allrecipe";
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send("data fetched . ...");
    });
});

/* ************************************ Fetch All Recipe By ID **************************************** */

app.get("/recipe/:id", (req, res)=>{
    const sql = `SElECT * FROM allrecipe WHERE id = ${req.params.id}`;
    db.query(sql, (err, result)=>{
        if(err) throw err;

        console.log(result);
        res.send("row fetched. ...");
    });
});


//server listening
app.listen(3000);

//validation function

let validation = (data)=>{
    let schema = {
        recipe: Joi.string().min(4).required(),
        price: Joi.number().min(3).required()
    };
    return Joi.validate(data, schema);
}