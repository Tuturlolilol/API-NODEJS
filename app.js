/** START Import Module Node */
const express = require('express'),
    userModel = require('./models/users.js').userModel,
    cors = require('cors'),
    bodyParser = require('body-parser');
/** END Import Module Node */


const app = express();


app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    next();
});

let urlencodedParser = bodyParser.urlencoded({
    extended: false
})

/** 
 * @route /
 * @method GET
 */
app.get('/', function(req, res, code = 200) {
    


            res.sendFile(__dirname + '/index.html')



})


/** 
 * Affichage des utilisateurs
 * @route /users
 * @method GET
 */
app.get('/users', function(req, res) {


    userModel.find({}, (err, users) => retour(res, users))
    
        
})

app.get('/admin', function(req, res) {


    res.sendFile(__dirname + '/index.html')

   
})

/*app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Erreur 404');
});*/


/** 
 * Affichage d'utilisateur
 * @route /users/:id
 * @method GET
 */
app.get('/users/:id', function(req, res) {
    userModel.findById(req.params.id, (err, theUser) => retour(res, theUser))
})

/** 
 * Logind'utilisateur
 * @route /login
 * @method POST
 */
app.post('/login', urlencodedParser, function(req, res) {

    if (

        req.body.email === undefined ||

        req.body.password === undefined) {

        retour(

            res, { error: true, message: "L'email/password est manquant" }, 401
        )

    } else {

        let user = new userModel({

            email: req.body.email,
            password: req.body.password

        })

        /* Tentative de connexion/session à faire*/

        userModel.find({ email: req.body.email }, (err, users) => {

            if (users.length === 0) {

                retour(res, { error: true, message: "Votre email ou password est éronné" }, 401)
            } 

            else {

                userModel.find({ password: req.body.password }, (err, passwords) => {

                    if (passwords.length === 0) {

                        retour(res, { error: true, message: "Votre email ou password est éronné" }, 401)
                    } 

                    else {

                        res.sendFile(__dirname + '/index.html')
                        

                    }
                })
            }
        })
    }
})

/** 
 * Création d'utilisateur
 * @route /Register
 * @method POST
 */
app.post('/register', urlencodedParser, function(req, res) {

    if (req.body.prenom.length < 5 ||  req.body.prenom.lenght > 25,
        req.body.nom.length < 5 ||  req.body.nom.lenght > 25,
        req.body.email.length < 10 ||  req.body.nom.email > 150,
        req.body.password.length < 7 ||  req.body.password.lenght > 20
        )
         {
        retour(

            res, { error: true, message: "L'une des données obligatoires n'ai pas conforme" }, 401

        )}

        let str = req.body.password;
        var Regex = /^(?=.[\d])(?=.[A-Z])(?=.[a-z])(?=.[!@#$%^&])[\w!@#$%^&]$/.test(str);
        if (!Regex) {
            retour(
                res, { error: true, message: "L'une des données obligatoires n'ai pas conforme" }, 401
            ) 
        }

        let chars = req.body.email.split('');
        if (!chars.includes('@')){
            retour(
                res, { error: true, message: "L'une des données obligatoires n'ai pas conforme" }, 401
            ) 
        }


    if (req.body.nom === undefined || 
        req.body.prenom === undefined ||
        req.body.email === undefined ||
        req.body.password === undefined ||
        req.body.date_naissance === undefined ||
        req.body.lieu === undefined) {
        retour(

            res, { error: true, message: "L'une ou plusieurs des données obligatoires sont manquantes" }, 401

        )
        
    }
     else {
        let user = new userModel({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: req.body.password,
            date_naissance: req.body.date_naissance,
            lieu: req.body.lieu,
        })
        userModel.find({ email: req.body.email }, (err, users) => {
            if (users.length != 0)
                retour(res, { error: true, message: "Votre email n'est pas correct" }, 401)
            else {
                user.save().then(() => {
                    retour(res, req.body, 201)
                })
            }
        })
    }
})

/** 
 * Mise à jour d'utilisateur
 * @route /users/:id
 * @method PUT
 */
app.put('/users/:id', urlencodedParser, function(req, res) {
    let newUser = Object.create(null);

    if (req.body.nom !== undefined)
        newUser.nom = req.body.nom
    if (req.body.prenom !== undefined)
        newUser.prenom = req.body.prenom
    if (req.body.date_naissance !== undefined)
        newUser.date_naissance = req.body.date_naissance
    if (req.body.lieu !== undefined)
        newUser.lieu = req.body.lieu

    userModel.updateOne({ _id: req.params.id }, newUser, (err) => {
        retour(res, req.body)
    })
})

/** 
 * Suppression de tout les utilisateurs
 * @route /users
 * @method DELETE
 */
app.delete('/users', function(req, res) {

    userModel.deleteMany({}, (err) => {
        retour(res, { error: false, message: "All user delete" })
    })
})

/** 
 * Suppression d'un utilisateur via sont id
 * @route /users/:id
 * @method DELETE
 */
app.delete('/users/:id', function(req, res) {
    userModel.deleteOne({ _id: req.params.id }, (err) => {
        retour(res, { error: false, message: "User deleted" })
    })
})

function retour(res, data, code = 200) {
    res.writeHead(code, {
        'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(data))
}
/** 
 * Ecoute du serveur sur le port 8080
 */
app.listen(8080, function() {
    console.log('Le serveur est run sur: http://localhost:8080/')

    
})