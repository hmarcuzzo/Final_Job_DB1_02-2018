const fs = require('fs');
const titulo = 'Estancia';
const subtitulo = 'Gerenciamento das estâncias dos clientes da loja';
const icone = 'fas fa-warehouse';
const url_add = '/estancias/adicionar/';
const url_update = '/estancias/editar/';
const url_list = '/estancias/';

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message_erro: '',
    message_sucesso: '',
    icone: icone,
    clientes: [],
    estancias: [],
    estancia: null,
    action: url_add
}

module.exports = {
    listarEstancia: (req, res) => {
        console.log("Executar açao de listar todos as estancias");

        dadosParaPagina.action = url_add;
        dadosParaPagina.message_sucesso = '';
        dadosParaPagina.message_erro = '';

        let query_clientes = "select * from Clientes";
        db.query(query_clientes, function (erro, resultado) {
            if (resultado) {
                dadosParaPagina.clientes = resultado;
            }
        });

        let query = "select e.*, c.* from estancia e, clientes c\
                where e.CPF_propietario = c.CPF";
        db.query(query, function (erro, resultado) {
            if (erro) {
                var message = "Não foi possivel listar estancias. Erro:" + erro;
                dadosParaPagina.message_erro = message;
            }

            dadosParaPagina.estancias = resultado;
            dadosParaPagina.estancia = null;
            res.render('estancias.ejs', dadosParaPagina);
        });
    },

    adicionarEstancia: (req, res) => {
        console.log("Executar açao de adicionar nova estância");

        // receber as variaveis do template ejs (html)
        let nome = req.body.nome_estancia;
        let cpfpropietario = req.body.clientes_cpf_proprietario;
        let referencia = req.body.referencia_estancia;

        //set data
        let data = {
            Nome_Estancia: nome,
            CPF_Propietario: cpfpropietario,
            Referencia: referencia
        };

        let insert = "INSERT INTO Estancia set ? ";
        db.query(insert, data, function (erro, resultado) {
            if (erro) {
                var message = "Não foi possivel adicionar a estancia";
                dadosParaPagina.message_erro = message;
                dadosParaPagina.action = url_add;
                res.render('estancias.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });

    },

    atualizarEstancia: (req, res) => {
        console.log("Executar açao de editar estancia");

        // receber as variaveis do template ejs (html)
        let cpf = req.body.clientes_cpf_proprietario;
        let codigo = req.body.codigo_estancia;
        let nome_estancia = req.body.nome_estancia;
        var referencia = req.body.referencia_estancia;

        //set data
        var data = {
            Nome_Estancia: nome_estancia,
            CPF_Propietario: cpf,
            Referencia: referencia
        };
        // console.log(data, id);
        // res.redirect(url);

        var insert = "UPDATE Estancia set ? WHERE Codigo = ? ";
        db.query(insert, [data, codigo], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel atualizar a estancia.Erro:" + erro;
                dadosParaPagina.action = url_update;
                res.render('estancias.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });
    },

    detalharEstancia: (req, res) => {
        console.log("Executar açao de listar a estancia selecionada");
        let codigo = req.params.codigo;

        let query_clientes = "select * from Clientes";
        db.query(query_clientes, function (erro, resultado) {
            if (resultado) {
                dadosParaPagina.clientes = resultado;
            }
        });


        let detalhar_estancia = "select e.*, c.* from estancia e, clientes c\
                where e.CPF_propietario = c.CPF";
        db.query(detalhar_estancia, function (erro, resultado) {
            if (!erro) {
                dadosParaPagina.estancias = resultado;
            }
        });

        console.log("codigo Estancia =", codigo)
        let query = "SELECT * FROM Estancia WHERE Codigo = ?";
        db.query(query, [codigo], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel encontrar estancia.Erro:" + erro;
                dadosParaPagina.action = url_add;
                res.render('estancias.ejs', dadosParaPagina);
            }
            dadosParaPagina.estancia = resultado[0];
            dadosParaPagina.action = url_update;
            res.render('estancias.ejs', dadosParaPagina);
        });
    },

    removerEstancia: (req, res) => {
        console.log("Executar açao de remover estancia codigo=", req.params.codigo);
        let codigo = req.params.codigo;

        let delete_data = "DELETE FROM Estancia WHERE Codigo = ?";
        db.query(delete_data, [codigo], function (erro, resultado) {
            if (!erro) {
                console.log("Apagado estância");
                return res.redirect(url_list);
            } else {
                dadosParaPagina.message_erro = "Não foi possivel remover estancia.Erro:" + erro;
                res.render('estancias.ejs', dadosParaPagina);
            }

        });
    }
};