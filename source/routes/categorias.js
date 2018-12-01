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
    message: '',
    icone: icone,
    categorias: [],
    categoria: null,
    action: url_add
}

module.exports = {
    listarCategoria: (req, res) => {
        console.log("Executar açao de listar todos as categorias");
        let query = "SELECT * FROM Categoria";
        db.query(query, (sql_erro, sql_resultado) => {
            if (sql_erro){
                dadosParaPagina.message = sql_erro;
            }
            
            dadosParaPagina.categorias = sql_resultado;
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';
            dadosParaPagina.categoria = null;
            res.render('categorias.ejs', dadosParaPagina);
        });
    },

    adicionarCategoria: (req, res) => {
        console.log("Executar açao de adicionar nova categoria");
        var message = '';
        var nome = req.body.nome_categoria;
        var descricao = req.body.descricao_categoria;
        
        //get data
        var data = {
            Nome: nome,
            Descricao: descricao
        };

        var insert = "INSERT INTO Categoria set ? "; 
        db.query(insert, data, (err, result) => {            
            if (err) {
                message = "Não foi possivel adicionar a categoria";    
                dadosParaPagina.message = message;
                res.render('clientes.ejs', dadosParaPagina);            

            }
            
            res.redirect(url_list);           
        });

    },

    atualizarCategoria: (req, res) => {
        console.log("Executar açao de editar categoria");
        let id = req.body.id_categoria;
        var message = '';
        var nome = req.body.nome_categoria;
        var descricao = req.body.descricao_categoria;
        
        //get data
        var data = {
            Nome: nome,
            Descricao: descricao
        };
        // console.log(data, id);
        // res.redirect(url);
        
        var insert = "UPDATE Categoria set ? WHERE ID = ? "; 
        db.query(insert, [data, id], (err, result) => {            
            if (err) {
                console.log("XIiiiiiii");
                message = "Não foi possivel atualizar a categoria";    
                dadosParaPagina.message = message;
                res.render('clientes.ejs', dadosParaPagina);            

            }
            console.log("deu bom!");
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';            
            res.redirect(url_list);           
        });
    },

    detalharCategoria: (req, res) => {        
        console.log("Executar açao de listar a categoria selecionada!!!");
        let id = req.params.id;
        
        var query = "SELECT * FROM Categoria WHERE ID = "+ id;
        db.query(query, (err, resultado) => {
            if (err) {
                return res.status(500).send(err);
            }            
            dadosParaPagina.categoria = resultado[0];
            dadosParaPagina.action = url_update;       
            // console.log(dadosParaPagina);
            res.render('categorias.ejs', dadosParaPagina);
        });
    },
    
    removerCategoria: (req, res) => {
        /*
            Para remover a categoria é necessario
            1 - Remover a categoria do Produto
            2 - Remover a categoria
        */
       let id = req.params.id;        
       console.log("Executar açao de remover categoria por ID =", id);

     //TODO: Remover relacoes dos produtos e categorias
    //    var select_produtos = "SELECT Codigo FROM produtos WHERE ID_Categoria =";
    //    db.query(select_cliente, [cpf], function(err, resultado){
    //        if(!err){
    //            telefone = resultado[0];
    //        }
    //    });
       
       var delete_data = "DELETE FROM Categoria  WHERE ID = ?"; 
       db.query(delete_data, [id], (err, result) => {            
           if (err) {
               message = "Não foi possivel remover a categoria";    
               dadosParaPagina.message = message;               
               res.render('categorias.ejs', dadosParaPagina);            

           }
           console.log("Apagado categoria");            
           res.redirect(url_list);           
       });
    }
};