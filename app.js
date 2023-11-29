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

conexao.connect();

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

app.get('/cadastro', (req,res)=>{
    let sql = 'SELECT idexercicio, nomeexercicio FROM ficha ORDER BY tipoexercicio';
    conexao.query(sql, function(err, results){
        if(err) throw err;
        res.render('cadastro', {
            title: "Início",
            favicon: "favicon.png",
            css: ['style-form.css'],
            exercicios:results,
        });
        
    });
})


// API

app.get('/api/exercises', (req,res)=> {
    conexao.query('SELECT * FROM ficha ORDER BY tipoexercicio', (error, results)=> {
        if(error) throw error;
        res.json(results);
    })
});

app.post('/api/cadastro', async (req,res) => {
    const {dia_treino, exercicios} = req.body;
    // if (!series || !repeticoes || !exercicios_id || !dia_treino) return res.json({status:'error', error:'Preencha todos os dados.'});
    // else {
    //     conexao.query('SELECT * FROM registro WHERE datatreino = ?', [dia_treino], async (err, result) => {
    //         if (err) throw err;
    //         if (result[0]) return res.json({status: 'error', error: 'Treino ja registrado.'})
    //         else {
    //             conexao.query('INSERT INTO registro SET ?' + 'INSERT INTO exercicios SET ?', {datatreino: dia_treino, ficha_idexercicio: exercicios_id,},
    //             (error, results) => {
    //                 if (error) throw error;
    //                 return res.json({status: 'success', success: 'Registrado.'})
    //             }
    //             )
    //         }
    //     })
    // }
});


app.listen(3000);