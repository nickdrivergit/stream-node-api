const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
const app = express();
const pool = require('./db');

var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(express.json(), cors(corsOptions));

app.listen(PORT, () => 
    console.log(`Server listening on ${PORT}!`)
)

// ROUTES //

// ADD DATA //

// Add student to Postgresql
app.post('/add-student', async(req, res) => {
    Object.values(req.body).forEach(element => {
        if (element === "")
            return res.status(400).send("You cannot pass empty values.");
    })
    try{
        const {firstName} = req.body;
        const {hairColor} = req.body;
        const {classroom} = req.body;
        const {surname} = req.body;
        const {emailAddress} = req.body;
        const {gender} = req.body;
        const {grade} = req.body;
        const newStudent = await pool.query(`
            INSERT INTO students 
            (
                first_name, 
                surname, 
                classroom, 
                email_address, 
                hair_color, 
                gender,
                grade
            )
            VALUES (
                '${firstName}', 
                '${surname}', 
                '${classroom}', 
                '${emailAddress}', 
                '${hairColor}', 
                '${gender}',
                '${grade}'
            ) 
            RETURNING *
            `)
        res.json(newStudent.rows[0]);
    } catch(err){
        console.error(err.message);
        res.status(400).send(err.message);
    }
})

// Add teacher to Postgresql
app.post('/add-teacher', async(req, res) => {
    Object.values(req.body).forEach(element => {
        if (element === "")
            return res.status(400).send("You cannot pass empty values.");
    })
    try{
        const {firstName} = req.body;
        const {grade} = req.body;
        const {subject} = req.body;
        const {classroom} = req.body;
        const {surname} = req.body;
        const {emailAddress} = req.body;
        const {gender} = req.body;
        const {age} = req.body;
        const newTeacher = await pool.query(`
            INSERT INTO teachers 
                (
                    first_name, 
                    surname, 
                    email_address, 
                    gender, 
                    grade, 
                    age, 
                    subject, 
                    classroom
                )
            VALUES 
                (
                    '${firstName}', 
                    '${surname}', 
                    '${emailAddress}', 
                    '${gender}', 
                    '${grade}', 
                    '${age}', 
                    '${subject}', 
                    '${classroom}'
                )
            RETURNING *
        `)
        res.json(newTeacher.rows[0]);
    } catch(err){
        console.error(err.message);
        res.status(400).send(err.message);
    }
})

// Add results to Postgresql
app.post('/add-result', async(req, res) => {
    Object.values(req.body).forEach(element => {
        if (element === "")
            return res.status(400).send("You cannot pass empty values.");
    })
    try{
        const {student_id} = req.body;
        const {subject} = req.body;
        const {result} = req.body;
        const newResult = await pool.query(`
            INSERT INTO results 
                (
                    student_id,
                    subject,
                    mark
                )
            VALUES 
                (
                    '${student_id}', 
                    '${subject}', 
                    '${result}'
                )
            RETURNING *
        `)
        res.json(newResult.rows[0]);
    } catch(err){
        console.error(err.message);
        res.status(400).send(err.message);
    }
})

// END ADD DATA //

// GET DATA //

//Get all students from Postgresql
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
        const results = await pool.query(`
            SELECT 
                * 
            FROM 
                students 
            WHERE 
                student_id = ${id}
        `);
        res.json(results.rows[0])
    } catch(err) {
        console.error(err.message);
    }
})

//Get all teachers from Postgresql
app.get('/get-teachers', async(req, res) => {
    try{
        const results = await pool.query(`SELECT * FROM teachers`);
        res.json(results.rows)
    } catch(err) {
        console.error(err.message);
    }
})

//Get specific student
app.get('/get-teacher/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const results = await pool.query(`
            SELECT 
                * 
            FROM 
                teachers 
            WHERE 
                teacher_id = ${id}
        `);
        res.json(results.rows[0])
    } catch(err) {
        console.error(err.message);
    }
})

//Get all results from Postgresql
app.get('/get-results', async(req, res) => {
    try{
        const results = await pool.query(`SELECT * FROM results`);
        res.json(results.rows)
    } catch(err) {
        console.error(err.message);
    }
})

//Get specific student's result
app.get('/get-result/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const results = await pool.query(`
            SELECT 
                * 
            FROM 
                results 
            WHERE 
                student_id = ${id}
        `);
        res.json(results.rows)
    } catch(err) {
        console.error(err.message);
    }
})

// END GET DATA //