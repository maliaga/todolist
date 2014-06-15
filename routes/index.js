/**
 * Created by awunnenb on 27.11.13.
 * Modified by awunneb on 08.06.14.
 */

// Database mongodb
// mongod muss vorher in der Console oder als Service gestartet sein
var databaseUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost";
// var databaseUrl = "todolist"; // optional: "username:password@localhost/todolist"
var collections = ["actions", "categories"]
var db = require("mongojs").connect(databaseUrl, collections);

//  Falls noch keine collection categories existiert, wird automatisch eine angelegt
db.categories.find().sort({name:1}, function(error, categories) {
    if (error || !categories) {
        console.log(error);
    } else {
        if (categories.length != 0) {
            console.log(categories.length + ' categories found');
        } else {
            defaultCategories = [{'name':'Büro'},{'name':'Rückruf'}, {'name':'Petra'}];

            db.categories.insert(defaultCategories,
                function(error){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(defaultCategories.length + ' categories created');
                    }
                });
        }
    }
});


// Formular Startseite index.jade aufrufen
exports.index = function(req, res){
    db.actions.find({status: "aktiv"}, function(error, actions) {
        if (error || !actions) {
            console.log("No active actions found");
            res.render('index', { title: 'Todo Home', actions: null});
        } else {
            res.render('index', { title: 'Todo Home', actions: actions });
        }
    });
};

// Formular new.jade aufrufen
exports.new = function(req, res){
    db.categories.find().sort({name:1}, function(error, categories) {
        if (error || !categories) {
            console.log("No Collection *categories* found!")
        } else {
            res.render('new', { title: 'Todo Neu', categories: categories });
        }
    });
};

// Formular edit.jade aufrufen
exports.edit = function(req, res){
    db.categories.find().sort({name:1}, function(error, categories) {
        if (error || !categories) {
            console.log("No Collection *categories* found!")
        } else {
            db.actions.findOne({"_id": db.ObjectId(req.params.id)}, function (error, action) {
                if (error || !action) {
                    console.log("ID not found");
                } else {
                    res.render('edit', { title: 'Todo Bearbeiten', action: action, categories: categories });
                }
            });
        }
    });
};

// Formular delete.jade aufrufen
exports.delete = function(req, res){
    db.actions.findOne({"_id": db.ObjectId(req.params.id)}, function(error, action) {
        if (error|| !action) {
            console.log("ID not found");
        } else {
            // Abfrage ob wirklich gelöscht werden soll
            res.render('delete', { title: 'Todo Löschen', action: action });
        }
    });
};

// Formulardaten speichern
exports.save = function(req, res){
    var action = req.body;
    console.log(action);
    if (!action) res.redirect('/home');
    action.status = "aktiv";
    var _id = req.params.id;
    // Update
    if (_id) {
        db.actions.update({_id: db.ObjectId(_id)}, action,
            function(error){
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/home");
                }
            });
        // Insert
    } else {
        db.actions.insert(action,
            function(error){
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/home");
                }
            });
    }
};

// Todoeintrag entfernen
exports.remove = function(req, res){
    var _id = db.ObjectId(req.params.id);
    db.actions.remove({_id: _id}, function(error){
        if (error) {
            console.log(error);
        } else {
            res.redirect("/home");
        }
    });
}

// Status auf erledigt setzen
exports.done = function(req, res) {
    var _id = db.ObjectId(req.params.id);
    db.actions.findOne({"_id": _id}, function(error) {
        if (error) {
            console.log("ID not found");
        } else {
            db.actions.update   ( { _id: _id }, { $set: { status: "erledigt" }});
            res.redirect("/home");
        }
    });

};
