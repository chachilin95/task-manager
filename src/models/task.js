const mongoose = require('mongoose');

const definition = {
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
};

const options = {
    timestamps: true
};

const taskSchema = new mongoose.Schema(definition, options);
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;