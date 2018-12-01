const titulo = 'Clientes';
const subtitulo = 'Gerenciamento de clientes da loja';
const icone = 'fas fa-users';
const url_list = '/clientes/';
const url_add = '/clientes/adicionar/';
const url_update = '/clientes/editar/'

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message: '',
    icone: icone,
    clientes: [],
    cliente: null,
    action: url_add
}

module.exports = {
    listarClientes: (req, res) => {
        console.log("Executar açao de listar todos os usuarios");

        var query_listar_clientes = " SELECT C.*, T.* "+ 
                                    " FROM Clientes C, Telefones T, Telefone_Cliente TC " + 
                                    " WHERE TC.CPF_Cliente = C.CPF AND TC.Num_Telefone = T.Numero;";
        db.query(query_listar_clientes, function(sql_erro, sql_resultado){
            if (sql_erro){
                dadosParaPagina.message = sql_erro;
            }
            
            dadosParaPagina.clientes = sql_resultado; //mostrar a lista geral de clientes
            dadosParaPagina.action = url_add;
            dadosParaPagina.cliente = null;
            dadosParaPagina.message = '';
            // console.log("Clientes para a tela=", dadosParaPagina);
            res.render('clientes.ejs', dadosParaPagina);

        });
    },


    adicionarCliente: (req, res) => {
        console.log("Executar açao de adicionar novo usuario");
        
        // receber as variaveis do template ejs (html)
        var nome = req.body.nome_cliente;
        var cpf = req.body.cpf_cliente;
        var telefone_cliente = req.body.tel_cliente;

        console.log("Adicionar os registros:", cpf, nome, telefone_cliente);

        if(nome == null || nome == '' || cpf == null || cpf == ''){
            dadosParaPagina.message = "Prencher os campos obrigatórios(cpf,nome)";
            dadosParaPagina.action = url_add;
            res.render('clientes.ejs', dadosParaPagina);            
        }

        //get data
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
        db.query(insert_telefone_cliente, data_telefone_cliente, (err, result) => {            
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
            
            res.redirect(url_list);           
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
        db.query(insert, [data,cpf], (err, resultado) => {            
            if (err) {
                message = "Não foi possivel atualizar o cliente";   
                dadosParaPagina.message = message;
                dadosParaPagina.action = url_update;

                res.render('clientes.ejs', dadosParaPagina);            

            }
            
            console.log("Aehooooo Atualizou!!!");
            res.redirect(url_list);           
        });
    },

    detalharCliente: (req, res) => {   
        /*
            Para editar as informaçoes do Cliente
            é necessario buscar primeiro as informaçoes no banco
            e depois retornar para a pagina
        */
        let cpf = req.params.cpf;        
        var clientes = [];
        console.log("Executar açao de editar  usuario CPF=", cpf);

        query = "SELECT C.*, T.* FROM Clientes C, Telefones T, Telefone_Cliente TC " + 
        "WHERE TC.CPF_Cliente = C.CPF AND TC.Num_Telefone = T.Numero AND C.CPF = '"+cpf+"'";
        db.query(query, (err, resultado) => {
            if (err) {
                return res.status(500).send(err);
            }     
            // console.log("Retornar os dados:", resultado);
            dadosParaPagina.cliente = resultado[0];
            dadosParaPagina.action = url_update;       
            // console.log(dadosParaPagina);
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
        let cpf = req.params.cpf;        
        var clientes = [];
        var message = '';
        var telefone = '';
        console.log("Executar açao de remover  usuario CPF=", cpf);

        var select_cliente = "SELECT Num_Telefone FROM Telefone_Cliente WHERE CPF_Cliente = ?";
        db.query(select_cliente, [cpf], function(err, resultado){
            if(!err){
                telefone = resultado[0];
            }
        });
        console.log("Selecionando Telefone Cliente");
        var delete_telefone_cliente = "DELETE FROM Telefone_Cliente WHERE CPF_Cliente = ?"; 
        db.query(delete_telefone_cliente, [cpf]); 
        console.log("Apagando Telefone Cliente");
        var delete_telefone = "DELETE FROM Telefones WHERE Numero = ?"; 
        db.query(delete_telefone, [telefone]);
        console.log("Apagando Telefone");
        var delete_cliente = "DELETE FROM Clientes  WHERE CPF = ?"; 
        db.query(delete_cliente, [cpf], (err, result) => {            
            if (err) {
                message = "Não foi possivel remover o cliente";    
                dadosParaPagina.message = message;
                
                res.render('clientes.ejs', dadosParaPagina);            

            }
            console.log("Apagando Cliente");            
            res.redirect(url_list);           
        });
    },

    buscarCPF: (req, res) => {
        let cpf = req.params.cpf;

        console.log("buscando usuario por CPF",cpf);

        var select_cliente = "SELECT CPF FROM Clientes WHERE CPF = ?";
        var resultados = [];
        db.query(select_cliente, [cpf], (err, result) => {
            resultados = result;
        });
        return res.status(200).send(resultados);

    }
};