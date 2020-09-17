const mongoose = require('mongoose');

const auth = require("./dbauth.json")

mongoose.connect(auth.uri, {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on("open", function(ref) {
    console.log("Connected to the MongoDB server.");
    var collections = ["users", "blogposts", "media", "analytics", "pages"]
    collections.forEach(coll => {
        mongoose.connection.db.listCollections({name: coll})
        .next(function(err, collinfo) {
            if (!collinfo) {
                switch (coll) {
                    case "users":
                        Users.createCollection()
                        break;
                    case "blogposts":
                        BlogPosts.createCollection()
                        break;
                    case "media":
                        Media.createCollection()
                        break;
                    case "analytics":
                        Analytics.createCollection()
                        break;
                    case "pages":
                        Pages.createCollection()
                        break;
                }
            }
        });
    })

});
  
mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!");
    return console.log(err);
});

const Users = mongoose.model('Users', new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    name: { 
        first: String,
        middle: String,
        last: String
    },
    slackUsername: String,
    createdAt: { type: Date, default: Date.now() }
}))

const BlogPosts = mongoose.model('BlogPosts', new mongoose.Schema({
    postid: String,
    postAuthor: String,
    postData: {
        title: String,
        subtitle: String,
        body: JSON
    },
    comments: [{
        author: String,
        body: String,
        date: Date
    }],
    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date, default: Date.now() }
}))

const Pages = mongoose.model('Pages', new mongoose.Schema({
    pageTitle: String,
    
    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date, default: Date.now() }
}))

const Analytics = mongoose.model('Analytics', new mongoose.Schema({

    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date, default: Date.now() }
}))

const Media = mongoose.model('Media', new mongoose.Schema({

    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date, default: Date.now() }
}))


module.exports = Users, BlogPosts, Pages, Analytics, Media