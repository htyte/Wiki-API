const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

// Connect to local DB
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = new mongoose.model('Article', articleSchema);

app.route('/articles')
    .get(function(req,res) {
        Article.find({}, function(err, results) {
            if(err) {
                console.log(err)
            } else {
                res.send(results)
            }
        })
    })
    .post(function(req,res) {
        const newTitle = req.body.title; 
        const newContent = req.body.content;
        const newArticle = new Article({
            title: newTitle,
            content: newContent
        })
        newArticle.save(function(err, result) {
            if(!err) {
                res.send('Successfully added')     
            } else {r
                res.send(err)
            }
        });
    })
    .delete(function(req,res) {
        Article.deleteMany({}, function(err) {
            if(!err) {
                res.send("successfully deleted");
            } else {
                res.send(err);
            }
        })
    });

app.route('/articles/:articleTitle')
    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle}, function(err, result) {
            if(!err) {
                console.log(result)
                res.send('Found It')
            } else {
                res.send(err)
            }
        })
        
    })
    .put(function(req,res) {
        Article.update(
            {title: req.params.articleTitle}, 
            {title: req.body.title, 
            content: req.body.content}, 
            {overwrite: true}, 
            function(err, result) {
                if(!err) {
                    res.send("successfully updated article")
                } else {
                    res.send(err);
                }
        })
    })
    .patch(function(req,res) {
        Article.updateOne(
            {title: req.params.articleTitle}, 
            {$set: req.body},
            function(err) {
                if(!err) {
                    res.send("Successfully updated article");
                } else {
                    res.send(err)
                }
            }
        )
    })
    .delete(function (req,res) {
        // Article.findOne({title: req.params.articleTitle}, function(err, result) {
        //     if(!err) {
        //         Article.findByIdAndDelete({_id: result._id}, function(err) {
        //             if(!err) {
        //                 res.send("Successfully deleted")
        //             } else {
        //                 res.send(err)
        //             }
        //         })
        //     } else {
        //         res.send(err)
        //     }
        // })
        Article.deleteOne({title: req.params.articleTitle}, function(err) {
            if(!err) {
                res.send("Succesfully deleted article");
            } else {
                res.send(err)
            }
        })
    });



















app.listen(PORT, () => {console.log('Server running on port: ', PORT)});