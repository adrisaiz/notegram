const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport-jwt');

const Note = require('../../models/Note');
const validateNoteInput = require('../../validation/note')
const validateTagInput = require('../../validation/tag')

router.get('/test', (req,res) => res.json({msg: "Notes works"}));


router.get('/:Id', passport.authenticate('jwt',{session: false}), (req, res)=>{
    Note.findById(req.param.id)
    .then(notes => res.json(notes))
    .catch(res.status(404).json({nonotefound: 'No note found with that ID'}));
});

router.get('/', passport.authenticate('jwt',{session: false}), (req, res)=>{
    Note.find()
    .sort({date: -1})
    .then(notes => res.json(notes))
    .catch(res.status(404).json({nonotesfound:'No notes found'}));
});

router.post('/', passport.authenticate('jwt',{session: false}), (req, res)=>{
    const {errors, isValid} = validateNoteInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }
    const newNote = new Note({
        text: req.body.text,
        name: req.body.name,
        user: req.user.id
    });
    newNote.save().then(note => res.json(note))
});

router.delete('/:Id', passport.authenticate('jwt', {session: false}),(req,res)=>{
    Note.findById(req.param.id)
    .then(note => {
        if (note.user.toString() !== req.user.id){
            return res.status(401).json({notauthorised: 'User not authorised'});
        } 
        note.remove().then(()=> res.json({success: true}))
        .catch(err => res.status(404).json({notenotfound: 'Note not found'}));
    })
});

router.post('/tags/:Id', passport.authenticate('jwt',{session: false}), (req, res)=>{
    const {errors, isValid} = validateTagInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }
    Note.findById(req.param.id)
    .then(note => {
        if (!note.tags.includes(req.body.text)){
            note.tags.unshift(req.body.text);
        note.save().then(post =>res.json(post))
        }else{
            res.status(404).json({tagexistent: 'Tag already existent'})
        }
    })
    .catch(error => res.status(404).json({notenotfound: 'Note not found'}));
    
});

router.delete('/tags/:Id', passport.authenticate('jwt',{session: false}), (req, res)=>{
    const {errors, isValid} = validateTagInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }
    Note.findById(req.param.id)
    .then(note => {
        if (note.tags.includes(req.body.text)){
            note.splice(note.tags.findIndex(req.body.text),1);
            note.save().then(post =>res.json(post))
        }else{
            res.status(404).json({tagnotfound: 'Tag not found'});
        }
        
    })
    .catch(error => res.status(404).json({notenotfound: 'Note not found'}));
    
});

module.exports = router;