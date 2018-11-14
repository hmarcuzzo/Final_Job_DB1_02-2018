const titulo = 'Clientes';
const subtitulo = 'Gerenciamento de clientes da loja';
const icone = 'fas fa-users';
const add = '/clientes/adicionar/';
const update = '/clientes/editar/'

module.exports = {
    listarClientes: (req, res) => {

        console.log("Executar açao de listar todos os usuarios");
        let query = "SELECT C.*, T.* FROM Clientes C, Telefones T, Telefone_Cliente TC WHERE TC.CPF_Cliente = C.CPF AND TC.Num_Telefone = T.Numero;";
        db.query(query, (err, resultado) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log(resultado);
            res.render('clientes.ejs', {
                subtitulo: subtitulo,
                titulo: titulo,
                message: '',
                icone: icone,
                clientes: resultado,
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
        var telefone_cliente = req.body.tel_cliente;

        console.log("nome, cpf",nome,cpf);
        if(nome == null || nome == '' || cpf == null || cpf == ''){
            res.render('clientes.ejs', {
                subtitulo: subtitulo,
                titulo: titulo,
                message: "Prencher os campos obrigatórios(cpf,nome)",
                icone: icone,
                action: add,
                clientes: [],
                cliente: null,
            });            
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

        var query = "SELECT C.*, T.* FROM Clientes C, Telefones T, Telefone_Cliente TC " + 
        "WHERE TC.CPF_Cliente = C.CPF AND TC.Num_Telefone = T.Numero";
        db.query(query, (err, result) => {
            clientes = result;
        });

        query = "SELECT C.*, T.* FROM Clientes C, Telefones T, Telefone_Cliente TC " + 
        "WHERE TC.CPF_Cliente = C.CPF AND TC.Num_Telefone = T.Numero AND C.CPF = '"+cpf+"'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }     
            console.log(result);       
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
                res.render('clientes.ejs', {
                    subtitulo: subtitulo,
                    titulo: titulo,
                    message: message,
                    icone: icone,
                    clientes: [],
                    cliente: null,
                });            

            }
            console.log("Apagando Cliente");
            
            res.redirect('/clientes/');           
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