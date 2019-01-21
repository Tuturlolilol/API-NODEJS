const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Users', function(err) {
    console.log((err) ? err : 'Connection au mongo correct')
        /*
            if(err)
                console.log((err))
            else
                console.log('Connection au mongo correct')
        */
});

const userSchema = mongoose.Schema({
        nom:{ type: String, 
            required: true,},
        prenom:{ type: String, 
            required: true,},
        email: { type: String, 
            required: true,},
        password: { type: String, 
            required: true,},
        date_naissance: { type: Date, 
            required: true,},
        lieu: { type: String, 
            required: true,},
        sexe: { type: String,
        enum: ["Homme", "Femme"],
        required: true,},
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            required: true
        },
    }),
    userModel = mongoose.model("users", userSchema)

exports.userModel = userModel