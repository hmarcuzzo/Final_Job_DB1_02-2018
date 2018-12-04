const fs = require('fs');
const titulo = 'Categorias';
const subtitulo = 'Gerenciamento de categorias para produtos da loja';
const icone = 'fas fa-tags';
const url_add = '/categorias/adicionar/';
const url_update = '/categorias/editar/';
const url_list = '/categorias/';

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message_erro: '',
    message_sucesso: '',
    icone: icone,
    categorias: [],
    categoria: null,
    action: url_add
}

module.exports = {
    listarCategoria: (req, res) => {
        console.log("Executar açao de listar todos as categorias");

        dadosParaPagina.action = url_add;
        dadosParaPagina.message_sucesso = '';
        dadosParaPagina.message_erro = '';

        let query = "SELECT * FROM Categoria";
        db.query(query, function (erro, resultado) {
            if (erro) {
                var message = "Não foi possivel listar clientes. Erro:" + erro;
                dadosParaPagina.message_erro = message;
            }
            dadosParaPagina.categorias = resultado;
            dadosParaPagina.categoria = null;
            res.render('categorias.ejs', dadosParaPagina);
        });
    },

    adicionarCategoria: (req, res) => {
        console.log("Executar açao de adicionar nova categoria");

        // receber as variaveis do template ejs (html)
        var message = '';
        var nome = req.body.nome_categoria;
        var descricao = req.body.descricao_categoria;

        //set Data
        var data = {
            Nome: nome,
            Descricao: descricao
        };

        var insert = "INSERT INTO Categoria set ? ";
        db.query(insert, data, function (erro, resultado) {
            if (erro) {
                var message = "Não foi possivel adicionar a categoria";
                dadosParaPagina.message_erro = message;
                dadosParaPagina.action = url_add;
                res.render('clientes.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });

    },

    atualizarCategoria: (req, res) => {
        console.log("Executar açao de editar categoria");

        // receber as variaveis do template ejs (html)
        let id = req.body.id_categoria;
        var message = '';
        var nome = req.body.nome_categoria;
        var descricao = req.body.descricao_categoria;

        //set data
        var data = {
            Nome: nome,
            Descricao: descricao
        };

        var insert = "UPDATE Categoria set ? WHERE ID = ? ";
        db.query(insert, [data, id], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel atualizar a categoria.Erro:" + erro;
                dadosParaPagina.action = url_update;
                res.render('categorias.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });
    },

    detalharCategoria: (req, res) => {
        console.log("Executar açao de listar a categoria ID = ", req.params.id);
        let id = req.params.id;

        var query = "SELECT * FROM Categoria WHERE ID = " + id;
        db.query(query, function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel encontrar categoria.Erro:" + erro;
                dadosParaPagina.action = url_add;
                res.render('categorias.ejs', dadosParaPagina);
            }
            dadosParaPagina.categoria = resultado[0];
            dadosParaPagina.action = url_update;
            res.render('categorias.ejs', dadosParaPagina);
        });
    },

    removerCategoria: (req, res) => {
        /*
            Para remover a categoria é necessario
            1 - Remover a categoria do Produto
            2 - Remover a categoria
        */
        console.log("Executar açao de remover categoria id=", req.params.id);
        let id = req.params.id;

        var delete_data = "DELETE FROM Categoria  WHERE ID = ?";
        db.query(delete_data, [id], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel remover categoria.Erro:" + erro;
                res.render('categorias.ejs', dadosParaPagina);
            }
            console.log("Apagado categoria");
            res.redirect(url_list);
        });
    }
};