const express = requier("express");
const cors = requier("cors");
const calendarApp = express();
calendarApp.use(cors());
calendarApp.use( express.json());
calendarApp.get("/events", (req, res) => {
    res.json ([
        { title: "subjects name" , date: "dates"}
        ]);
    const port = 3000;
    calendarApp.listen(port), () => {
    console.log("Backend running on port 3000");
    });
        
