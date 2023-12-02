const express = require('express');
const mysql = require('mysql');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars'); // Importe o módulo handlebars
const app = express();
const path = require('path');

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use('/bootstrap', express.static("./node_modules/bootstrap/dist"));
app.use('/ver/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/ver/images', express.static(path.join(__dirname, 'public/images')));
app.use('/css', express.static("./public/css", {strict: false}));
app.use('/java', express.static("./public/js"));
app.use('/images', express.static("./public/images"));
app.use('/icon', express.static("./node_modules/bootstrap-icons/icons"));
app.use('/ver', express.static(path.join(__dirname, 'public')));


handlebars.registerHelper('formatarData', function(data) {
    const dataObj = new Date(data);
    const dia = dataObj.getDate();
    const mes = dataObj.getMonth() + 1;
    const ano = dataObj.getFullYear();
    const horas = dataObj.getHours();
    const minutos = dataObj.getMinutes();

    // Adiciona zero à esquerda se o número for menor que 10
    const minutosFormatados = minutos < 10 ? `0${minutos}` : minutos;

    const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutosFormatados}`;
    return dataFormatada;
});

var conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'academia'
});

app.get('/', (req, res) => {
    let sql = 'SELECT idexercicio, nomeexercicio FROM ficha';
    conexao.query(sql, function (err, results) {
        if (err) throw err;
        res.render('home', {
            title: "Início",
            favicon: "favicon.png",
            css: ['style-home.css'],
            exercicios: results,
            navbar: 'navbar-light'
        });
    });
});

app.get('/cadastro', (req, res) => {
    let sql = 'SELECT idexercicio, nomeexercicio FROM ficha';
    conexao.query(sql, function (err, results) {
        if (err) throw err;
        res.render('cadastro', {
            title: "Cadastro",
            favicon: "favicon.png",
            css: ['style-form.css'],
            exercicios: results,
            navbar: 'navbar-dark bg-dark'
        });
    });
});

app.get('/historico', (req,res) => {
    let sql = 'SELECT * FROM registro';
    conexao.query(sql, function(err, results) {
        if (err) throw err;
        res.render('historico', {
            title: 'Histórico',
            favicon: 'favicon.png',
            css: ['style-hist.css'],
            ficha: results,
            navbar: 'navbar-dark bg-dark'
        })
    })
})

app.get('/ver/:iddia', (req, res) => {
    const idRegistro = req.params.iddia;

    // Consulta para obter os exercícios com base no ID do registro
    let sql = 'SELECT * FROM exercicios INNER JOIN ficha ON ficha.idexercicio = exercicios.ficha_idexercicio WHERE idregistro = ?';
    conexao.query(sql, [idRegistro], function(err, exercicios) {
        if (err) throw err;
        res.render('ver', {
            title: 'Visualizar Exercício',
            favicon: 'favicon.png',
            css: ['style-ver.css'],
            exercicios: exercicios,
            navbar: 'navbar-dark bg-dark'
        });
    });
});

// API
app.get('/api/exercises', (req, res) => {
    conexao.query('SELECT * FROM ficha', (error, results) => {
        if (error) throw error;
        res.json(results);
    })
});

app.post('/api/cadastro', async (req, res) => {
    const treino = req.body;
    const dia_treino = treino.dia_treino;
  
    // Faz o insert na tabela registro
    await conexao.query('INSERT INTO registro SET datatreino = ?', [dia_treino]);
  
    // Pega o valor do ID que foi gerado
    const idregistro = await new Promise((resolve, reject) => {
        conexao.query('SELECT LAST_INSERT_ID() as id', (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].id);
          }
        });
      });
    for (const exercicio of treino.exercicios) {
      // Usa o ID da linha na tabela exercicios
    await conexao.query('INSERT INTO exercicios SET ficha_idexercicio = ?, carga = ?, series = ?, repeticoes = ?, idregistro = ?', [exercicio.exercicio_id, exercicio.carga, exercicio.series, exercicio.repeticoes, idregistro],
        (error, results) => {
          if (error) throw error;
        }
      );
    }
    res.json({ status: 'success', success: 'Registrado!' });
});
  
  


app.listen(3000);