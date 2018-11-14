const fs = require('fs');
const titulo = 'Clientes';
const subtitulo = 'Gerenciamento de clientes da loja';
const icone = 'fas fa-users';
const add = '/clientes/adicionar/';
const update = '/clientes/editar/'

module.exports = {
    listarClientes: (req, res) => {

        console.log("Executar açao de listar todos os usuarios");
        let query = "SELECT * FROM Clientes";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('clientes.ejs', {
                subtitulo: subtitulo,
                titulo: titulo,
                message: '',
                icone: icone,
                clientes: result,
                cliente: null,
                action: add
            });
        });
    },

    adicionarCliente: (req, res) => {
        console.log("Executar açao de adicionar novo usuario");
        var message = '';
        var nome = req.body.nome_cliente;
        var cpf = req.body.cpf_cliente;
        
        console.log(req.body, nome, cpf);

        //get data
        var data = {
            nome: nome,
            cpf: cpf
        };
        
        var insert = "INSERT INTO Clientes set ? "; 
        db.query(insert, data, (err, result) => {            
            if (err) {
                message = "Não foi possivel adicionar o cliente";    
                res.render('clientes.ejs', {
                    subtitulo: subtitulo,
                    titulo: titulo,
                    message: message,
                    icone: icone,
                    clientes: [],
                    cliente: null,
                });            

            }
            
            res.redirect('/clientes/');           
        });

    },

    atualizarCliente: (req, res) => {
        console.log("Executar açao de editar usuario");
        var message = '';
        var nome = req.body.nome_cliente;
        var cpf = req.body.cpf_cliente;
        
        //get data
        var data = {
            nome: nome,
            cpf: cpf
        };
        
        var insert = "UPDATE Clientes set ? WHERE cpf = ? "; 
        db.query(insert, [data,cpf], (err, result) => {            
            if (err) {
                message = "Não foi possivel atualizar o cliente";    
                res.render('clientes.ejs', {
                    subtitulo: subtitulo,
                    titulo: titulo,
                    message: message,
                    icone: icone,
                    clientes: [],
                    cliente: null,
                });            

            }
            
            res.redirect('/clientes/');           
        });
    },

    detalharCliente: (req, res) => {        
        let cpf = req.params.cpf;        
        var clientes = [];
        console.log("Executar açao de editar  usuario CPF=", cpf);

        var query = "SELECT * FROM Clientes";
        db.query(query, (err, result) => {
            clientes = result;
        });

        query = "SELECT * FROM Clientes WHERE CPF="+cpf;
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }            
            res.render('clientes.ejs', {
                subtitulo: subtitulo,
                titulo: titulo,
                message: '',
                icone: icone,
                clientes: clientes,
                cliente: result[0],
                action: update
            });
        });
    },
    
    removerCliente: (req, res) => {
        let cpf = req.params.cpf;        
        var clientes = [];
        var message = '';
        console.log("Executar açao de remover  usuario CPF=", cpf);
        var insert = "DELETE FROM Clientes  WHERE cpf = ? "; 
        db.query(insert, [cpf], (err, result) => {            
            if (err) {
                message = "Não foi possivel remover o cliente";    
                res.render('clientes.ejs', {
                    subtitulo: subtitulo,
                    titulo: titulo,
                    message: message,
                    icone: icone,
                    clientes: [],
                    cliente: null,
                });            

            }
            
            res.redirect('/clientes/');           
        });
    }
};