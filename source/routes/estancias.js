const fs = require('fs');
const titulo = 'Estancia';
const subtitulo = 'Gerenciamento das estâncias dos clientes da loja';
const icone = 'fas fa-tags';
const url_add = '/estancias/adicionar/';
const url_update = '/estancias/editar/';
const url_list = '/estancias/';

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message: '',
    icone: icone,
    estancias: [],
    estancia: null,
    action: url_add
}

module.exports = {
    listarEstancia: (req, res) => {
        console.log("Executar açao de listar todos as estancias");
        let query = "SELECT * FROM Estancia";
        db.query(query, (sql_erro, sql_resultado) => {
            if (sql_erro){
                dadosParaPagina.message = sql_erro;
            }
            
            dadosParaPagina.estancias = sql_resultado;
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';
            dadosParaPagina.estancia = null;
            res.render('estancias.ejs', dadosParaPagina);
        });
    },

    adicionarEstancia: (req, res) => {
        console.log("Executar açao de adicionar nova estância");
        var message = '';
        var nome = req.body.nome_estancia;
        var cpfpropietario = req.body.cpf_propietario;
        var referencia = req.body.referencia_estancia;
        
        //get data
        var data = {
            Nome_Estancia: nome,
            CPF_Propietario: cpfpropietario,
            Referencia: referencia
        };

        var insert = "INSERT INTO Estancia set ? "; 
        db.query(insert, data, (err, result) => {            
            if (err) {
                message = "Não foi possivel adicionar a estancia";    
                dadosParaPagina.message = message;
                res.render('estancias.ejs', dadosParaPagina);            

            }
            
            res.redirect(url_list);           
        });

    },

    atualizarEstancia: (req, res) => {
        console.log("Executar açao de editar estancia");
        let cpf = req.body.cpf_propietario;
        var message = '';
        var nome = req.body.nome_estancia;
        var referencia = req.body.referencia_estancia;
        
        //get data
        var data = {
            Nome_Estancia: nome,
            CPF_Propietario: cpf,
            Referencia: referencia
        };
        // console.log(data, id);
        // res.redirect(url);
        
        var insert = "UPDATE Estancia set ? WHERE CPF_propietario = ? "; 
        db.query(insert, [data, id], (err, result) => {            
            if (err) {
                console.log("XIiiiiiii");
                message = "Não foi possivel atualizar a categoria";    
                dadosParaPagina.message = message;
                res.render('estancias.ejs', dadosParaPagina);            

            }
            console.log("deu bom!");
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';            
            res.redirect(url_list);           
        });
    },

    detalharEstancia: (req, res) => {        
        console.log("Executar açao de listar a estancia selecionada!!!");
        let cpf = req.params.cpf;
        
        var query = "SELECT * FROM Estancia WHERE CPF_propietario = "+ cpf;
        db.query(query, (err, resultado) => {
            if (err) {
                return res.status(500).send(err);
            }            
            dadosParaPagina.categoria = resultado[0];
            dadosParaPagina.action = url_update;       
            // console.log(dadosParaPagina);
            res.render('estancias.ejs', dadosParaPagina);
        });
    },
    
    removerEstancia: (req, res) => {
        /*
            Para remover a categoria é necessario
            1 - Remover a categoria do Produto
            2 - Remover a categoria
        */
       let cpf = req.params.cpf;        
       console.log("Executar açao de remover categoria por ID =", cpf);

     //TODO: Remover relacoes dos produtos e categorias
    //    var select_produtos = "SELECT Codigo FROM produtos WHERE ID_Categoria =";
    //    db.query(select_cliente, [cpf], function(err, resultado){
    //        if(!err){
    //            telefone = resultado[0];
    //        }
    //    });
       
       var delete_data = "DELETE FROM Categoria  WHERE CPF_propietario = ?"; 
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