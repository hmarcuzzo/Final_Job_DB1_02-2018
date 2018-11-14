const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const port = 8000; //porta padrão
const {getTelaInicial} = require('./routes/index');
const {listarClientes, adicionarCliente, atualizarCliente, detalharCliente, removerCliente, buscarCPF} = require('./routes/clientes');


// connect to database
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'agropec.admin',
    password: 'admin',
    database: 'Agropec'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder


// Rota principal
app.get('/', getTelaInicial);
app.get('/inicio', getTelaInicial);

// // CRUD Cliente
app.get('/clientes', listarClientes);
app.post('/clientes/adicionar', adicionarCliente);
app.get('/clientes/editar/:cpf', detalharCliente);
app.post('/clientes/editar', atualizarCliente);
app.get('/clientes/remover/:cpf', removerCliente);
app.get('/clientes/buscarCPF/:cpf', buscarCPF);

// //CRUD
// app.get('/estancia', getTelaEstancia);
// app.get('/funcionarios', getTelaFuncionario);
// app.get('/produtos', getTelaProduto);
// app.get('/vendas', getTelaVenda);
// app.get('/categorias', getTelaCategoria);
// app.get('/fornecedores', getTelaFornecedor);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});