const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
const app = express();
const pool = require('./db');

app.use(express.json());

app.listen(PORT, () => 
    console.log(`Server listening on ${PORT}!`)
)

// ROUTES //

// Add student to Postgresql
app.post('/add-student', async(req, res) => {
    Object.values(req.body).forEach(element => {
        if (element === "")
            return res.status(400).send("You cannot pass empty values.");
    })
    try{
        const {firstName} = req.body;
        const {hairColor} = req.body;
        const {classRoom} = req.body;
        const {grade} = req.body;
        const {surname} = req.body;
        const {emailAddress} = req.body;
        const {gender} = req.body;
        const newStudent = await pool.query(`INSERT INTO students (first_name, surname, grade, class_room, email, hair_colour, gender)
        VALUES ('${firstName}', '${surname}', ${grade}, '${classRoom}', '${emailAddress}', '${hairColor}', '${gender}') RETURNING *`)
        res.json(newStudent.rows[0]);
    } catch(err){
        console.error(err.message);
        res.status(400).send(err.message);
    }
})

//Retrieve records from Postgresql
app.get('/get-students', async(req, res) => {
    try{
        const results = await pool.query(`SELECT * FROM students`);
        res.json(results.rows)
    } catch(err) {
        console.error(err.message);
    }
})

//Get specific student
app.get('/get-student/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const results = await pool.query(`SELECT * FROM students WHERE student_id = ${id}`);
        res.json(results.rows[0])
    } catch(err) {
        console.error(err.message);
    }
})