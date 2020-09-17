const mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/frcms', {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on("open", function(ref) {
    console.log("Connected to mongo server.");
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
}, {
    autoCreate: true
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
}, {
    autoCreate: true
}))

const Pages = mongoose.model('Pages', new mongoose.Schema({
    pageTitle: String,
    
    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date, default: Date.now() }
}, {
    autoCreate: true
}))

const Analytics = mongoose.model('Analytics', new mongoose.Schema({

    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date, default: Date.now() }
}, {
    autoCreate: true
}))

const Media = mongoose.model('Media', new mongoose.Schema({

    createdAt: { type: Date, default: Date.now() },
    modifiedAt: { type: Date, default: Date.now() }
}, {
    autoCreate: true
}))

module.exports = Users, BlogPosts, Pages, Analytics, Media