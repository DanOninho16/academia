const express = require('express');
const mysql = require('mysql');
const {engine} = require('express-handlebars');

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use('/bootstrap', express.static("./node_modules/bootstrap/dist"));
app.use('/css', express.static("./public/css"));
app.use('/java', express.static("./public/js"));
app.use('/images', express.static("./public/images"));
app.use('/icon', express.static("./node_modules/bootstrap-icons/icons"));

var conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'academia'
});

app.get('/', (req, res)=> {
    let sql = 'SELECT idexercicio, nomeexercicio FROM ficha';
    conexao.query(sql, function(err, results){
        if(err) throw err;
        res.render('home', {
            title: "Início",
            favicon: "favicon.png",
            css: ['style-home.css'],
            exercicios:results,
        });
        
    });
});



app.get('/api/exercises', (req,res)=> {
    conexao.query('SELECT * FROM ficha', (error, results)=> {
        if(error) throw error;
        res.json(results);
    })
})

app.listen(3000)