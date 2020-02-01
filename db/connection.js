
const mongoose = require("mongoose").set('debug', false);

mongoose.Promise = global.Promise;


if (mongoose.connection.readyState == 0 ) {
	let userinfo = process.env.MON_USE + ':' + process.env.MON_NYCKELN;
	mongoose.connect('mongodb+srv://' + userinfo + '@cluster0-j0bpo.mongodb.net/blobbobot?retryWrites=true', { useNewUrlParser: true });
} else {
	console.log("Already connected " + mongoose.connection.readyState);

}

mongoose.connection.on('open', function () {
    console.log('Connected to mongo server.');
    mongoose.connection.db.listCollections().toArray(function(err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
        
    });

});