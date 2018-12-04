const fs = require('fs');
const titulo = 'Fornecedores';
const subtitulo = 'Gerenciamento de fornecedores para a loja';
const icone = 'fas fa-truck';
const url_add = '/fornecedores/adicionar/';
const url_update = '/fornecedores/editar/';
const url_list = '/fornecedores/';

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message_erro: '',
    message_sucesso: '',
    icone: icone,
    fornecedores: [],
    fornecedor: null,
    action: url_add
}

module.exports = {
    listarFornecedor: (req, res) => {
        console.log("Executar açao de listar todos os fornecedores");

        dadosParaPagina.action = url_add;
        dadosParaPagina.message_sucesso = '';
        dadosParaPagina.message_erro = '';

        let query = "SELECT * FROM Fornecedor";
        db.query(query, function (erro, resultado) {
            if (erro) {
                var message = "Não foi possivel listar fornecedores. Erro:" + erro;
                dadosParaPagina.message_erro = message;
            }

            dadosParaPagina.fornecedores = resultado;
            dadosParaPagina.fornecedor = null;
            res.render('fornecedores.ejs', dadosParaPagina);
        });
    },

    adicionarFornecedor: (req, res) => {
        console.log("Executar açao de adicionar novo fornecedor");

        // receber as variaveis do template ejs (html)
        var nome = req.body.nome_fornecedor;
        var telefone = req.body.tel_fornecedor;

        if (nome === undefined || nome == '') {
            var message = "Preencher o campo Nome obrigatório";
            dadosParaPagina.message_erro = message;
            dadosParaPagina.action = url_add;
            res.render('fornecedores.ejs', dadosParaPagina);
        }

        //set data
        var data = {
            Nome: nome,
            Tel: telefone
        };

        var insert = "INSERT INTO Fornecedor set ? ";
        db.query(insert, data, function (erro, resultado) {
            if (erro) {
                var message = "Não foi possivel adicionar o fornecedor";
                dadosParaPagina.message_erro = message;
                dadosParaPagina.action = url_add;
                res.render('fornecedores.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });

    },

    atualizarFornecedor: (req, res) => {
        console.log("Executar açao de editar fornecedor");

        // receber as variaveis do template ejs (html)
        let id = req.body.id_fornecedor;
        var message = '';
        var nome = req.body.nome_fornecedor;
        var telefone = req.body.tel_fornecedor;

        //set data
        var data = {
            Nome: nome,
            Tel: telefone
        };

        var insert = "UPDATE Fornecedor set ? WHERE ID = ? ";
        db.query(insert, [data, id], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel atualizar o fornecedor.Erro:" + erro;
                dadosParaPagina.action = url_update;
                res.render('fornecedores.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });
    },

    detalharFornecedor: (req, res) => {
        console.log("Executar açao de listar fornecedor id = ", req.params.id);
        let id = req.params.id;

        var query = "SELECT * FROM Fornecedor WHERE ID = " + id;
        db.query(query, function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel encontrar fornecedor.Erro:" + erro;
                dadosParaPagina.action = url_add;
                res.render('fornecedores.ejs', dadosParaPagina);
            }
            dadosParaPagina.fornecedor = resultado[0];
            dadosParaPagina.action = url_update;
            res.render('fornecedores.ejs', dadosParaPagina);
        });
    },

    removerFornecedor: (req, res) => {
        console.log("Executar açao de remover Fornecedor id=", req.params.id);
        let id = req.params.id;

        var delete_data = "DELETE FROM Fornecedor  WHERE ID = ?";
        db.query(delete_data, [id], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel remover Fornecedor.Erro:" + erro;
                res.render('fornecedores.ejs', dadosParaPagina);

            }
            res.redirect(url_list);
        });
    }
};