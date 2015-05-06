/**
 * Created by macmini on 5/5/15.
 */
var express     = require('express');
var router      = express.Router();
var Group       = require('../models/group');
var HttpStatus = require('http-status-codes');

// create group
router.post('/', function(req, res){
  if(req.user.role === 'teacher'){
    var name = req.body.name;
    Group.findByName(name, function(err, group){
      if(group === null){
        var group = new Group();
        group.name = name;
        group.description = req.body.description;
        group.subject = req.body.subject;
        group.teachers = [req.user._id];
        group.students = [];
        group.created = new Date();
        group.updated = new Date();
        group.save(function(err){
          if(err){
            res.send(err);
          }else{
            res.json({message: 'Group created'});
          }
        });
      }else{
        res.status(HttpStatus.CONFLICT).json({message: 'Group existed'});
      }
    });
  }else{
    res.status(HttpStatus.METHOD_NOT_ALLOWED).json({message: 'User is not allowed to create group'});
  }
});

// get all groups
router.get('/', function(req, res){
  Group.getByUserId(req.user._id, function(err, groups){
    if(!err){
      console.log('Groups: ' + groups.length);
      res.json(groups);
    }else{
      res.send(err);
    }
  });
});

// get a group
router.get('/:id', function(req, res){
  Group.findById(req.params.id, function(err, group){
    if(group !== null){
      res.json(group);
    }else{
      res.status(404).json({message: 'Group not found'});
    }
  });
});

module.exports = router;