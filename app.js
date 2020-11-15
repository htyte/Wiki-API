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

app.get('/articles', function(req, res) {
    Article.find({}, function(err, results) {
        if(err) {
            console.log(err)
        } else {
            res.send(results)
        }
    })
})

app.post('/articles', function(req,res) {
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
    // res.render('article', {title: result.title, content: result.content})
   
})

app.get('/article', function(req, res) {
    res.render('article')
})

app.get('/articles/:id', function(req, res) {

})


















app.listen(PORT, () => {console.log('Server running on port: ', PORT)});