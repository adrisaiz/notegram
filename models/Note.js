const mongoose = require('mongoose');

const Schema = new mongoose.Schema;

const NoteSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    tags: [{
        type: String
    }
    ],
    comments: [
        {
            user:{
                type: Schema.Types.ObjectId,
        ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            }
        }
    ]
});

module.exports = Note = mongoose.model('note', NoteSchema);