const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const port = 8000; //porta padrão
const { getTelaInicial } = require('./routes/index');
const { listarClientes, adicionarCliente, atualizarCliente, detalharCliente, removerCliente, buscarCPF } = require('./routes/clientes');
const { listarCategoria, adicionarCategoria, atualizarCategoria, detalharCategoria, removerCategoria } = require('./routes/categorias');
const { listarFornecedor, adicionarFornecedor, atualizarFornecedor, detalharFornecedor, removerFornecedor } = require('./routes/fornecedores');
const { listarEstancia, adicionarEstancia, atualizarEstancia, detalharEstancia, removerEstancia } = require('./routes/estancias');
const { listarProduto, adicionarProduto, atualizarProduto, detalharProduto, removerProduto } = require('./routes/produtos');
const { listarFuncionario, adicionarFuncionario, atualizarFuncionario, detalharFuncionario, removerFuncionario } = require('./routes/funcionarios');
const { mostrarListagemVenda, pesquisarVenda, listarVenda, adicionarVenda, atualizarVenda, detalharVenda, removerVenda } = require('./routes/vendas');

// connect to database
const db = mysql.createConnection({
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

// CRUD Cliente
app.get('/clientes', listarClientes);
app.post('/clientes/adicionar', adicionarCliente);
app.get('/clientes/editar/:cpf', detalharCliente);
app.post('/clientes/editar', atualizarCliente);
app.get('/clientes/remover/:cpf', removerCliente);
app.get('/clientes/buscarCPF/:cpf', buscarCPF);

// CRUD Categorias
app.get('/categorias', listarCategoria);
app.post('/categorias/adicionar', adicionarCategoria);
app.get('/categorias/editar/:id', detalharCategoria);
app.post('/categorias/editar/', atualizarCategoria);
app.get('/categorias/remover/:id', removerCategoria);

//CRUD Fornecedores
app.get('/fornecedores', listarFornecedor);
app.post('/fornecedores/adicionar', adicionarFornecedor);
app.get('/fornecedores/editar/:id', detalharFornecedor);
app.post('/fornecedores/editar/', atualizarFornecedor);
app.get('/fornecedores/remover/:id', removerFornecedor);

//CRUD Estancia
app.get('/estancias', listarEstancia);
app.post('/estancias/adicionar', adicionarEstancia);
app.get('/estancias/editar/:codigo', detalharEstancia);
app.post('/estancias/editar/', atualizarEstancia);
app.get('/estancias/remover/:codigo', removerEstancia);


//CRUD Produtos
app.get('/produtos', listarProduto);
app.post('/produtos/adicionar', adicionarProduto);
app.get('/produtos/editar/:codigo', detalharProduto);
app.post('/produtos/editar/', atualizarProduto);
app.get('/produtos/remover/:codigo', removerProduto);

//CRUD Funcionarios
app.get('/funcionarios', listarFuncionario);
app.post('/funcionarios/adicionar', adicionarFuncionario);
app.get('/funcionarios/editar/:cpf', detalharFuncionario);
app.post('/funcionarios/editar/', atualizarFuncionario);
app.get('/funcionarios/remover/:cpf', removerFuncionario);

//CRUD Vendas
app.get('/vendas', listarVenda);
app.get('/vendas/pesquisar', mostrarListagemVenda);
app.post('/vendas/pesquisar', pesquisarVenda);
app.post('/vendas/adicionar', adicionarVenda);
app.get('/vendas/editar/:codigo', atualizarVenda);
app.post('/vendas/editar/', detalharVenda);
app.get('/vendas/remover/:codigo', removerVenda);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});