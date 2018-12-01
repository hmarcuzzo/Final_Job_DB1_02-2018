const fs = require('fs');
const titulo = 'Fornecedores';
const subtitulo = 'Gerenciamento de fornecedores para a loja';
const icone = 'fas fa-tags';
const url_add = '/fornecedores/adicionar/';
const url_update = '/fornecedores/editar/';
const url_list = '/fornecedores/';

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message: '',
    icone: icone,
    fornecedores: [],
    fornecedor: null,
    action: url_add
}

module.exports = {
    listarFornecedor: (req, res) => {
        console.log("Executar açao de listar todos os fornecedores");
        let query = "SELECT * FROM Fornecedor";
        db.query(query, (sql_erro, sql_resultado) => {
            if (sql_erro){
                dadosParaPagina.message = sql_erro;
            }
            
            dadosParaPagina.fornecedores = sql_resultado;
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';
            dadosParaPagina.fornecedor = null;
            res.render('fornecedores.ejs', dadosParaPagina);
        });
    },

    adicionarFornecedor: (req, res) => {
        console.log("Executar açao de adicionar novo fornecedor");
        var message = '';
        var nome = req.body.nome_fornecedor;
        var telefone = req.body.tel_fornecedor;
        
        //get data
        var data = {
            Nome: nome,
            Tel: telefone
        };

        var insert = "INSERT INTO Fornecedor set ? "; 
        db.query(insert, data, (err, result) => {            
            if (err) {
                message = "Não foi possivel adicionar o fornecedor";    
                dadosParaPagina.message = message;
                res.render('clientes.ejs', dadosParaPagina);            

            }
            
            res.redirect(url_list);           
        });

    },

    atualizarFornecedor: (req, res) => {
        console.log("Executar açao de editar fornecedor");
        let id = req.body.id_fornecedor;
        var message = '';
        var nome = req.body.nome_fornecedor;
        var telefone = req.body.tel_fornecedor;
        
        //get data
        var data = {
            Nome: nome,
            Tel: telefone
        };
        
        var insert = "UPDATE Fornecedor set ? WHERE ID = ? "; 
        db.query(insert, [data, id], (err, result) => {            
            if (err) {                
                message = "Não foi possivel atualizar o fornecedor";    
                dadosParaPagina.message = message;
                res.render('fornecedores.ejs', dadosParaPagina);            

            }            
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';            
            res.redirect(url_list);           
        });
    },

    detalharFornecedor: (req, res) => {        
        console.log("Executar açao de listar o fornecedor selecionado!!!");
        let id = req.params.id;
        
        var query = "SELECT * FROM Fornecedor WHERE ID = "+ id;
        db.query(query, (err, resultado) => {
            if (err) {
                return res.status(500).send(err);
            }            
            dadosParaPagina.fornecedor = resultado[0];
            dadosParaPagina.action = url_update;       
            // console.log(dadosParaPagina);
            res.render('fornecedores.ejs', dadosParaPagina);
        });
    },
    
    removerFornecedor: (req, res) => {
        /*
            Para remover o fornecedor é necessario
        */
       let id = req.params.id;        
       console.log("Executar açao de remover fornecedor por ID =", id);
       
       var delete_data = "DELETE FROM Fornecedor  WHERE ID = ?"; 
       db.query(delete_data, [id], (err, result) => {            
           if (err) {
               message = "Não foi possivel remover a fornecedor";    
               dadosParaPagina.message = message;               
               res.render('fornecedores.ejs', dadosParaPagina);            

           }           
           res.redirect(url_list);           
       });
    }
};