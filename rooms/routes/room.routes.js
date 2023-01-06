const express = require("express");
const Room = require("../models/Room.model");
const router = express.Router();


router.get("/list", (req, res) => {

  Room.find()
    .then( rooms => res.render("rooms/list", {rooms}))
    .catch(err => console.log(err))


});

router.get("/create-room", (req, res) => {
    res.render("rooms/create-room");
  });
  

  router.post("/create-room", (req, res) => {
    const { name, description, imageUrl } = req.body;
    Room.create({name, description, imageUrl })
    .then(() =>  res.redirect("/rooms/list"))
    .catch(err => console.log(err))
  });
  
 


module.exports = router;