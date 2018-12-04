const fs = require('fs');
const titulo = 'Produtos';
const subtitulo = 'Gerenciamento de produtos da loja';
const icone = 'fas fa-box-open';
const url_add = '/produtos/adicionar/';
const url_update = '/produtos/editar/';
const url_list = '/produtos/';

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message_erro: '',
    message_sucesso: '',
    icone: icone,
    produtos: [],
    produto: null,
    categorias: [],
    fornecedores: [],
    action: url_add
}

module.exports = {
    listarProduto: (req, res) => {
        console.log("Executar açao de listar todos os produtos da loja");

        dadosParaPagina.action = url_add;
        dadosParaPagina.message_sucesso = '';
        dadosParaPagina.message_erro = '';

        let query_categorias = "SELECT * FROM Categoria";
        db.query(query_categorias, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.categorias = resultado;
            }
        });

        let query_fornecedores = "SELECT * FROM Fornecedor";
        db.query(query_fornecedores, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.fornecedores = resultado;
            }
        });

        let query_produtos = "select p.*, f.Nome as Nome_Fornecedor, c.Nome as Nome_Categoria " +
            "from produtos p, fornecedor f, categoria c " +
            "where p.ID_categoria = c.ID and p.ID_fornecedor = f.ID";
        db.query(query_produtos, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.produtos = resultado;
                dadosParaPagina.produto = null;
                res.render('produtos.ejs', dadosParaPagina);
            }


        });

    },

    adicionarProduto: (req, res) => {
        console.log("Executar açao de adicionar novo produto");
        var message = '';

        /* parametros */
        var nome = req.body.nome_produto;
        var descricao = req.body.descricao_produto;
        var categorias = req.body.categorias;
        var fornecedores = req.body.fornecedores;
        var preco = req.body.preco;
        var qtd_estoque = req.body.qtd_estoque;

        //get data
        var data = {
            Nome: nome,
            Preco: parseFloat(preco, 0.0),
            Descricao: descricao,
            ID_categoria: parseInt(categorias),
            ID_fornecedor: parseInt(fornecedores),
            QTD_Estoque: parseInt(qtd_estoque, 0)
        };

        var query_insert = "INSERT INTO Produtos set ? ";
        db.query(query_insert, data, function (erro, resultado) {
            if (!erro) {
                res.redirect(url_list);
            }

            message = "Não foi possivel adicionar produto";
            dadosParaPagina.message_erro = message;
            res.render('produtos.ejs', dadosParaPagina);
        });

    },

    atualizarProduto: (req, res) => {
        console.log("Executar açao de editar produto ", req.body.codigo_produto);

        /* parametros */
        var codigo = req.body.codigo_produto;
        var nome = req.body.nome_produto;
        var descricao = req.body.descricao_produto;
        var categorias = req.body.categorias;
        var fornecedores = req.body.fornecedores;
        var preco = req.body.preco;
        var qtd_estoque = req.body.qtd_estoque;

        //get data
        var data = {
            Nome: nome,
            Preco: parseFloat(preco, 0.0),
            Descricao: descricao,
            ID_categoria: parseInt(categorias),
            ID_fornecedor: parseInt(fornecedores),
            QTD_Estoque: parseInt(qtd_estoque, 0)
        };

        var insert = "UPDATE Produtos set ? WHERE Codigo = ? ";
        db.query(insert, [data, codigo], function (erro, resultado) {
            if (erro) {
                message = "Não foi possivel atualizar produto";
                dadosParaPagina.message_erro = message + err;
                res.render('produtos.ejs', dadosParaPagina);

            }
            dadosParaPagina.action = url_add;
            dadosParaPagina.message_erro = '';
            dadosParaPagina.message_sucesso = "Produto atualizado com sucesso";
            res.redirect(url_list);
        });
    },

    detalharProduto: (req, res) => {
        console.log("Executar açao de listar o produto selecionado");
        let codigo = req.params.codigo;

        console.log("Codigo=", codigo);
        let query_categorias = "SELECT * FROM Categoria";
        db.query(query_categorias, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.categorias = resultado;
            }
        });

        let query_fornecedores = "SELECT * FROM Fornecedor";
        db.query(query_fornecedores, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.fornecedores = resultado;
            }
        });

        let query_produtos = "select p.*, f.Nome as Nome_Fornecedor, c.Nome as Nome_Categoria " +
            "from produtos p, fornecedor f, categoria c " +
            "where p.ID_categoria = c.ID and p.ID_fornecedor = f.ID";
        db.query(query_produtos, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.produtos = resultado;
            }
        });

        var query_produto = "SELECT * FROM Produtos WHERE Codigo = " + codigo;
        db.query(query_produto, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.produto = resultado[0];
                dadosParaPagina.action = url_update;
                res.render('produtos.ejs', dadosParaPagina);
            }
        });

    },

    removerProduto: (req, res) => {
        console.log("Remover o produto ", req.params.codigo);

        let codigo = req.params.codigo;

        /*
          TODO: verificar dependencia de produtos
          - QTDE_Vendida        
          - Venda
        */

        var query_vendas = "SELECT COUNT(*) as Total_Vendas FROM QTDE_Vendida WHERE Cod_produto = " + codigo;
        db.query(query_vendas, function (erro, resultado) {
            if (resultado) {
                dadosParaPagina.message_erro = "Não será possivel porque foi encontrado "
                    + resultado[0].Total_Vendas;
                + " vendas relacionadas";
            }

            if (erro) {
                message = "Não foi possivel remover o produto " + codigo;
                dadosParaPagina.message_erro = message + err;
                res.render('produtos.ejs', dadosParaPagina);
            }

        });


        var query_produto = "DELETE FROM Produtos WHERE Codigo = " + codigo;
        db.query(query_produto, function (erro, resultado) {
            if (erro) {
                message = "Não foi possivel remover o produto " + codigo;
                dadosParaPagina.message_erro = message + err;
                res.render('produtos.ejs', dadosParaPagina);
            } else {
                dadosParaPagina.message_sucesso = "Produto removido com sucesso";
                res.redirect(url_list);
            }
        });

    }
};