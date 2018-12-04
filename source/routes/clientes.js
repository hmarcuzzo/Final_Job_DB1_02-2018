const titulo = 'Clientes';
const subtitulo = 'Gerenciamento de clientes da loja';
const icone = 'fas fa-users';
const url_list = '/clientes/';
const url_add = '/clientes/adicionar/';
const url_update = '/clientes/editar/'

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message_erro: '',
    message_sucesso: '',
    icone: icone,
    clientes: [],
    cliente: null,
    action: url_add
}

module.exports = {
    listarClientes: (req, res) => {
        console.log("Executar açao de listar todos os clientes");

        dadosParaPagina.action = url_add;
        dadosParaPagina.message_sucesso = '';
        dadosParaPagina.message_erro = '';

        var query_listar_clientes = " SELECT C.*, T.* " +
            " FROM Clientes C, Telefones T, Telefone_Cliente TC " +
            " WHERE TC.CPF_Cliente = C.CPF AND TC.Num_Telefone = T.Numero;";
        db.query(query_listar_clientes, function (erro, resultado) {
            if (erro) {
                var message = "Não foi possivel listar clientes. Erro:" + erro;
                dadosParaPagina.message_erro = message;
            }

            dadosParaPagina.clientes = resultado;
            dadosParaPagina.action = url_add;
            dadosParaPagina.cliente = null;
            res.render('clientes.ejs', dadosParaPagina);

        });
    },

    adicionarCliente: (req, res) => {
        console.log("Executar açao de adicionar novo cliente");

        // receber as variaveis do template ejs (html)
        var nome = req.body.nome_cliente;
        var cpf = req.body.cpf_cliente;
        var telefone_cliente = req.body.tel_cliente;

        console.log("Adicionar cliente com os dados:", cpf, nome, telefone_cliente);
        if (nome == null || nome == '' || cpf == null || cpf == '') {
            dadosParaPagina.message_erro = "Prencher os campos obrigatórios(cpf,nome)";
            dadosParaPagina.action = url_add;
            res.render('clientes.ejs', dadosParaPagina);
        }

        //set Data
        var data_cliente = {
            Nome: nome,
            CPF: cpf
        };

        var data_telefone = {
            Numero: telefone_cliente,
        };

        var data_telefone_cliente = {
            Num_Telefone: telefone_cliente,
            CPF_Cliente: cpf
        };

        /*
            Acoes a serem executadas no Banco de Dados
            1 - Cadastrar novo Cliente
            2 - Cadastrar telefone do novo Cliente
            3 - Cadastrar relacao de cliente com telefone
        */

        var insert_cliente = "INSERT INTO Clientes set ? ";
        db.query(insert_cliente, data_cliente);

        var insert_telefone = "INSERT INTO Telefones set ? ";
        db.query(insert_telefone, data_telefone);

        var insert_telefone_cliente = "INSERT INTO Telefone_Cliente set ? ";
        db.query(insert_telefone_cliente, data_telefone_cliente, function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel adicionar o cliente.Erro:" + erro;
                dadosParaPagina.action = url_add;
                res.render('clientes.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });

    },

    atualizarCliente: (req, res) => {
        console.log("Executar açao de editar cliente");

        // receber as variaveis do template ejs (html)
        var nome = req.body.nome_cliente;
        var cpf = req.body.cpf_cliente;

        //set data
        var data = {
            Nome: nome,
            CPF: cpf
        };

        var insert = "UPDATE Clientes set ? WHERE cpf = ? ";
        db.query(insert, [data, cpf], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel atualizar o cliente.Erro:" + erro;
                dadosParaPagina.action = url_update;
                res.render('clientes.ejs', dadosParaPagina);
            }
            res.redirect(url_list);
        });
    },

    detalharCliente: (req, res) => {
        /*
            Para editar as informaçoes do Cliente
            é necessario buscar primeiro as informaçoes no banco
            e depois retornar para a pagina
        */
        console.log("Executar açao de editar cliente CPF=", req.params.cpf);
        let cpf = req.params.cpf;

        query = "SELECT C.*, T.* FROM Clientes C, Telefones T, Telefone_Cliente TC " +
            "WHERE TC.CPF_Cliente = C.CPF AND TC.Num_Telefone = T.Numero AND C.CPF = '" + cpf + "'";
        db.query(query, function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel encontrar o cliente.Erro:" + erro;
                dadosParaPagina.action = url_add;
                res.render('clientes.ejs', dadosParaPagina);
            }
            dadosParaPagina.cliente = resultado[0];
            dadosParaPagina.action = url_update;
            res.render('clientes.ejs', dadosParaPagina);
        });
    },

    removerCliente: (req, res) => {
        /*
            Para remover um cliente é necessario
            1 - encontrar a relacao de cliente e telefone
            2 - remover o telefone do cliente
            3 - remover o cliente
        */
        console.log("Executar açao de remover cliente CPF=", req.params.cpf);
        let cpf = req.params.cpf;
        var telefone = '';

        var query_verifica_venda = "select count(*) as venda from vendas where CPF_cliente = ?";
        db.query(query_verifica_venda, [cpf], function (erro, resultado){
            if(resultado){
                var venda = resultado[0].venda;
                console.log("venda = ", venda);

                if(parseInt(venda) > 0){
                    dadosParaPagina.message_erro = "Esse cliente possui vendas e não pode ser apagado!";
                    res.render('clientes.ejs', dadosParaPagina);
                }
            }
        });
        var select_cliente = "SELECT Num_Telefone FROM Telefone_Cliente WHERE CPF_Cliente = ?";
        db.query(select_cliente, [cpf], function (erro, resultado) {
            if (!erro) {
                telefone = resultado[0];
            }
        });
        console.log("Selecionando Estancia Cliente");
        var delete_estancia_cliente = "DELETE FROM Estancia WHERE CPF_propietario = ?";
        db.query(delete_estancia_cliente, [cpf]);
        console.log("Selecionando Telefone Cliente");
        var delete_telefone_cliente = "DELETE FROM Telefone_Cliente WHERE CPF_Cliente = ?";
        db.query(delete_telefone_cliente, [cpf]);
        console.log("Apagando Telefone Cliente");
        var delete_telefone = "DELETE FROM Telefones WHERE Numero = ?";
        db.query(delete_telefone, [telefone]);
        console.log("Apagando Telefone");
        var delete_cliente = "DELETE FROM Clientes  WHERE CPF = ?";
        db.query(delete_cliente, [cpf], function (erro, resultado) {
            if (erro) {
                dadosParaPagina.message_erro = "Não foi possivel remover o cliente.Erro:" + erro;
                res.render('clientes.ejs', dadosParaPagina);

            }
            console.log("Apagando Cliente");
            res.redirect(url_list);
        });
    },

    buscarCPF: (req, res) => {
        let cpf = req.params.cpf;

        console.log("Buscando cliente por CPF", cpf);

        var select_cliente = "SELECT CPF FROM Clientes WHERE CPF = ?";
        var resultados = [];
        db.query(select_cliente, [cpf], (err, result) => {
            resultados = result;
        });
        return res.status(200).send(resultados);

    }
};