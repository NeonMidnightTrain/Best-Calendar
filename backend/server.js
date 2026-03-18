const express = require("express");
const cors = require("cors");

const calendarApp = express();
calendarApp.use(cors());
calendarApp.use(express.json());

let events = [];
let tasks = [];

calendarApp.get("/events", (req, res) => {
    res.json(events);
});

calendarApp.post("/events", (req, res) => {
    const { title, date, time } = req.body;
    const newEvent = { id: Date.now(), title, date, time };
    events.push(newEvent);
    res.status(201).json(newEvent);
});

calendarApp.get("/tasks", (req, res) => {
    res.json(tasks);
});

calendarApp.post("/tasks", (req, res) => {
    const { title, dueDate, completed = false } = req.body;
    const newTask = { id: Date.now(), title, dueDate, completed };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

const port = 3000;
calendarApp.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
