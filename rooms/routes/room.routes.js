const express = require("express");
const { isOwnser } = require("../middleware/route-guard");
const Room = require("../models/Room.model");
const router = express.Router();


router.get("/list", (req, res) => {

  Room.find()
    .then( rooms => {
      console.log(rooms);
      res.render("rooms/list", {rooms})
    })

    .catch(err => console.log(err))
    


});

router.get("/create-room", (req, res) => {
    console.log(req.session.currentUser);
    res.render("rooms/create-room", req.session.currentUser);
  });
  

  router.post("/create-room", (req, res) => {
    const { name, description, imageUrl, userId } = req.body;
    Room.create({name, description, imageUrl, owner: userId })
    .then(() =>  res.redirect("/rooms/list"))
    .catch(err => console.log(err))
  });

  router.get('/:id/edit', (req, res, next) => {
  
    const { id } = req.params;

    Room.findById(id)
    
      .then(foundRoom => {
        console.log("Current room owner: ",foundRoom.owner.toString());
        console.log("Current user: ", req.session.currentUser.id);

        if(foundRoom.owner.toString() === req.session.currentUser.id){
          
          res.render('rooms/edit-form', foundRoom)
        }else{
          console.log("Not accessible page");
        }
        
      
      })
      
      .catch(err => console.log(err))
    
  });

  router.post('/:id/edit', (req, res, next) => {
    
    const { name, description, imageUrl} = req.body;
    const { id } = req.params;
  
    Room.findByIdAndUpdate(id, {name, description, imageUrl})
        .then(() => res.redirect('/rooms/list'))
        .catch(err => console.log(err))
    
  });
  
 
  router.post('/:id/delete', (req, res, next) => {
    // Iteration #5: Delete the drone
    const { id } = req.params;
  
    Room.findByIdAndDelete(id)
        .then(() => res.redirect('/rooms/list'))
        .catch(err => console.log(err))
  });

module.exports = router;