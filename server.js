/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Kabeer Harjani Student ID: 129754222 Date: 2024-01-14
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 

//Store express, cors, dotenv unmodifiable variables (initialize)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

//Config dotenv
dotenv.config();

//Allow access to express 
const app = express();

//Using cors as middleware
app.use(cors());

//Parsing JSON in req body
app.use(express.json());

//Port connecting to
const HTTP_PORT = process.env.PORT || 8080;

//get functions from moviesDB.js and create a new MoviesDB schema (store under db variable)
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

 //Default endpoint -> Test if server is working
app.get("/", (req, res) => {
    res.json({message: "API Listening"}) //send JSON object to '/' endpoint
});

//POST method - Add a new movie to the API
app.post("/api/movies", async (req, res) => {

    const newMovie = req.body; 

    try {
        await db.addNewMovie(newMovie)
        return res.status(201).json({message: "SUCCESS: Movie has been added!"}); //201 status code -> creation of a resource
    } catch (err) {
        console.log(err) //error handling 
        return res.status(500).json({message: "ERROR: Movie could not be added"}); //500 status code -> Unexpected error causing failure of creation resource
    }
});


//GET method: api/movies api endpoint that can filter out movies by page, perPage and title
app.get("/api/movies", async (req, res) => {
    
    const page = req.query.page; //get the page and store it into variable 
    const perPage = req.query.perPage; //get the perPage and store it into variable 
    const title = req.query.title; //get the title and store it into variable

    try {
        const match = await db.getAllMovies(page, perPage, title);
        return res.status(200).json(match); //200 status code -> Success found resources
    } catch (err) {
        console.error(err); //error handling
        return res.status(500).json({message: "ERROR: Movies could not be found!"}); //500 status code -> Unexpected error
    }
});

//GET method: api/movies/:_id - take a route parameter (_id) to find movies with a specific _id 
app.get("/api/movies/:_id", async (req, res) => {

    const _id = req.params._id; //get the route stored in variable _id

    try {
        const match = await db.getMovieById(_id); 
        return res.status(200).json(match); //200 status code -> Success found resources
    } catch (err) {
        console.log(err); //error handling
        return res.status(500).json({message: "ERROR: Movies could not be found!"}); //500 status code -> Unexpected error
    }
});

//PUT method: update a existing movie
app.put("/api/movies/:_id", async (req, res) => {
    const _id = req.params._id; //get the _id route store as variable _id (target what is being updated)
    const data = req.body; //get the data that is being updated store in variable data (update to this data)

    try {
        await db.updateMovieById(data, _id);
        return res.status(200).json({message: "SUCCESS: Movie has been updated!"}); //200 status code -> Resource has been updated
    } catch (err) {
        console.log(err); //error handling
        return res.status(500).json({message: "ERROR: Movie could not be updated!"}); //500 status code -> Unexpected error
    }
});

//DELETE method: delete a existing movie
app.delete('/api/movies/:_id', async (req, res) => {

    const _id = req.params._id; //get the targeted movie (_id) movie object trying to delete

    try {
        await db.deleteMovieById(_id);
        return res.status(200).json({message: "SUCCESS: Movie has been deleted"}); //200 status code -> Success resource deleted
    } catch (err) {
        console.log(err); //error handling
        return res.status(500).json({message: "ERROR: Movie could not be deleted"}); //500 status code -> Unexpected error
    }
});

//Check if everything is working right otherwise throw out error to console and start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});