const fs = require('fs');
const titulo = 'Funcionários';
const subtitulo = 'Gerenciamento dos Funcionários da loja';
const icone = 'fas fa-user-cog';
const url_add = '/funcionarios/adicionar/';
const url_update = '/funcionarios/editar/';
const url_list = '/funcionarios/';

const dadosParaPagina = {
    subtitulo: subtitulo,
    titulo: titulo,
    message: '',
    icone: icone,
    funcionarios: [],
    funcionario: null,
    action: url_add
}

module.exports = {
    listarFuncionario: (req, res) => {
        console.log("Executar açao de listar todos os funcionários");
        let query = " select f1.CPF, f1.Nome, f1.Tipo, f2.Nome as Supervisor, a.Nro_Vendas as Qtde" +
                    " from funcionarios f1, atendente a, funcionarios f2 " +
                    " where f1.CPF = a.CPF_Atendente and f1.CPF_Supervisor = f2.CPF " +                    
                    " UNION " +                    
                    " select f1.CPF, f1.Nome, f1.Tipo, f2.Nome as Supervisor, ft.Nro_Entregas as Qtde " +
                    " from funcionarios f1, freteiro ft, funcionarios f2 " +
                    " where f1.CPF = ft.CPF_FRETEIRO and f1.CPF_Supervisor = f2.CPF " +
                    " UNION " +                    
                    " select f1.CPF, f1.Nome, f1.Tipo, f2.Nome as Supervisor, 0 as Qtde " +
                    " from funcionarios f1, funcionarios f2 " +
                    " where f1.Tipo = 'supervisor' and f1.CPF_Supervisor = f2.CPF ";
        db.query(query, (sql_erro, sql_resultado) => {
            if (sql_erro){
                dadosParaPagina.message = sql_erro;
            }
            
            dadosParaPagina.funcionarios = sql_resultado;
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';
            dadosParaPagina.funcionario = null;
            res.render('funcionarios.ejs', dadosParaPagina);
        });
    },

    adicionarFuncionario: (req, res) => {
        console.log("Executar açao de adicionar novo funcionário");
        var message = '';
        var nome = req.body.nome_funcionario;
        var cpf = req.body.cpf_funcionario;
        var cargo = req.body.cargos_funcionario;
        var cpf_supervisor = req.body.supervisor_funcionario;

        //get data
        var data = {           
            CPF: cpf,
            Nome: nome,
            Tipo: cargo,
            CPF_Supervisor: cpf_supervisor
        };        
        
        var insert = "INSERT INTO Funcionarios SET ? ";
        db.query(insert, data, (err, result) => {            
            if (err) {
                message = "Não foi possivel adicionar o funcionario";    
                dadosParaPagina.message = message;
                console.log("fudeu!", err)
                res.render('funcionarios.ejs', dadosParaPagina);
            }         
            console.log(result);
        });
        console.log("Adicionou o funcionario");
        
        if(cargo === "Atendente"){
            console.log(" ENTRA AQUI!!!!");
            var query = "INSERT INTO Atendente SET ? "; 
            var dados_atendente = {               
                CPF_Atendente: cpf,
                Nro_Vendas: 0
            }    
            db.query(query, dados_atendente, (err, resultado) =>{
                if (err) {
                    message = "Não foi possivel adicionar o Atendente"; 

                    var delete_query = "DELETE FROM Funcionarios WHERE CPF ? ";
                    db.query(delete_query, [cpf]);     

                    dadosParaPagina.message = message;                    
                    res.render('funcionarios.ejs', dadosParaPagina);
                    console.log("Deu erro, apagou!");
                }
                console.log(resultado);
            });
        }
        else if(cargo === "Freteiro"){
            var query = "INSERT INTO Freteiro SET ? "; 
            var dados_freteiro = {
                Nro_Entregas: 0,
                CPF_Freteiro: cpf
            }    
            db.query(query, dados_freteiro, (err, resultado) =>{
                if (err) {
                    message = "Não foi possivel adicionar o Freteiro"; 
                    
                    var delete_query = "DELETE FROM Funcionarios WHERE CPF ? ";
                    db.query(delete_query, [cpf]); 

                    dadosParaPagina.message = message;
                    res.render('funcionarios.ejs', dadosParaPagina);
                }
                console.log(resultado);
            });
        }
        else if(cargo === "Supervisor"){
            var query = "INSERT INTO Supervisor SET ? "; 
            var dados_freteiro = {
                CPF_Supervisor: cpf_supervisor,
                CPF_Supervisionado: cpf
            }    
            db.query(query, dados_freteiro, (err, resultado) =>{
                if (err) {
                    message = "Não foi possivel adicionar o Supervisor"; 
                    
                    var delete_query = "DELETE FROM Funcionarios WHERE CPF ? ";
                    db.query(delete_query, [cpf]);

                    dadosParaPagina.message = message;
                    res.render('funcionarios.ejs', dadosParaPagina);
                }
                console.log(resultado);
            });
        }
        res.redirect(url_list);
    },

    atualizarFuncionario: (req, res) => {
        

        console.log("Executar açao de editar funcionário");
        var message = '';
        var nome = req.body.nome_funcionario;
        var cpf = req.body.cpf_funcionario;
        var cargo = req.body.cargos_funcionario;
        var cpf_supervisor = req.body.supervisor_funcionario;
        
        //get data
        var data = {
            CPF: cpf,
            Nome: nome,
            Tipo: cargo,
            CPF_Supervisor: cpf_supervisor
        };
        // console.log(data, id);
        // res.redirect(url);

       var cargo1 = null;
        var query_busca_funcionario = "SELECT Tipo FROM Funcionarios WHERE CPF = "+ cpf; 
        db.query(query_busca_funcionario, [cpf], (err, resultado) =>{
             if (err) {
                 message = "Não foi possivel achar o cargo do Funcionario";    
                 dadosParaPagina.message = message;                    
                 res.render('funcionarios.ejs', dadosParaPagina);
             }
        });            
        cargo1 = resultado[0].Tipo;
        console.log("Identificado o Funcionario com Cargo =", cargo1);


        // Tenta fazer o UPDATE!
        var insert = "UPDATE Funcionarios set ? WHERE CPF = ? "; 
        db.query(insert, [data, cpf], (err, result) => {            
            if (err) {
                console.log("XIiiiiiii");
                message = "Não foi possivel atualizar o funcionário";    
                dadosParaPagina.message = message;
                res.render('funcionarios.ejs', dadosParaPagina);            

            }
            console.log("deu bom!");
            dadosParaPagina.action = url_add;
            dadosParaPagina.message = '';      
        });

        //Conseguiu fazer o UPDATE vai remover a antiga relação
        if(cargo1 !== cargo){
            if(cargo1 === "Atendente"){
                var query = "DELETE FROM Atendente WHERE CPF_Atendente= ? "; 
                db.query(query, [cpf], (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel remover o Atendente";    
                        dadosParaPagina.message = message;                    
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }    
                    console.log("Removido o atendente com sucesso.");
                });
            }
            else if(cargo1 === "Freteiro"){
                var query = "DELETE FROM Freteiro WHERE CPF_Freteiro = ? ";
                db.query(query, [cpf], (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel remover o Freteiro";                       
                        dadosParaPagina.message = message;
                        console.log(err);
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }                    
                    console.log("Removido o freteiro com sucesso.");
                });
            }
            else if(cargo1 === "Supervisor"){
                var query = "DELETE FROM Supervisor WHERE CPF_Supervisor = ? or CPF_Supervisonado = ? ";   
                db.query(query, [cpf, cpf], (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel remover o Supervisor";                        
                        dadosParaPagina.message = message;
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }                    
                    console.log("Removido o supervisor com sucesso.");
                });
            }
        }

        // Removeu a antiga relação vai fazer a nova relação
        if(cargo1 !== cargo){
            if(cargo === "Atendente"){
                console.log(" ENTRA AQUI!!!!");
                var query = "INSERT INTO Atendente SET ? "; 
                var dados_atendente = {               
                    CPF_Atendente: cpf,
                    Nro_Vendas: 0
                }    
                db.query(query, dados_atendente, (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel adicionar o Atendente"; 
    
                        var delete_query = "DELETE FROM Funcionarios WHERE CPF ? ";
                        db.query(delete_query, [cpf]);     
    
                        dadosParaPagina.message = message;                    
                        res.render('funcionarios.ejs', dadosParaPagina);
                        console.log("Deu erro, apagou!");
                    }
                    console.log(resultado);
                });
            }
            else if(cargo === "Freteiro"){
                var query = "INSERT INTO Freteiro SET ? "; 
                var dados_freteiro = {
                    Nro_Entregas: 0,
                    CPF_Freteiro: cpf
                }    
                db.query(query, dados_freteiro, (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel adicionar o Freteiro"; 
                        
                        var delete_query = "DELETE FROM Funcionarios WHERE CPF ? ";
                        db.query(delete_query, [cpf]); 
    
                        dadosParaPagina.message = message;
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }
                    console.log(resultado);
                });
            }
            else if(cargo === "Supervisor"){
                var query = "INSERT INTO Supervisor SET ? "; 
                var dados_freteiro = {
                    CPF_Supervisor: cpf_supervisor,
                    CPF_Supervisionado: cpf
                }    
                db.query(query, dados_freteiro, (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel adicionar o Supervisor"; 
                        
                        var delete_query = "DELETE FROM Funcionarios WHERE CPF ? ";
                        db.query(delete_query, [cpf]);
    
                        dadosParaPagina.message = message;
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }
                    console.log(resultado);
                });
            }
        }

        res.redirect(url_list);
    },

    detalharFuncionario: (req, res) => {        
        console.log("Executar açao de listar o funcionário selecionado!!!");
        let cpf = req.params.cpf;
        
        var query = "SELECT * FROM Funcionarios WHERE CPF = "+ cpf;
        db.query(query, (err, resultado) => {
            if (err) {
                return res.status(500).send(err);
            }            
            dadosParaPagina.funcionario = resultado[0];
            dadosParaPagina.action = url_update;       
            console.log(dadosParaPagina);
            res.render('funcionarios.ejs', dadosParaPagina);
        });
    },
    
    removerFuncionario: (req, res) => {
        /*
        ATENÇÃO: AS CONSULTAS DEVEM SER FEITAS DENTRO DE DB.QUERY nesse caso.
        Para remover o funcionario é necessario buscar todas as informacoes do mesmo
        Após encontrar os dados do funcionarios:
        - Armazenar o Tipo do Funcionario (Cargo)
        - verificar em qual tabela precisa ser removido (de acordo com o cargo)
        */

       let cpf = req.params.cpf;    
       console.log("Executar açao de remover funcionário por CPF =", cpf);

       var cargo = null;
       var query_busca_funcionario = "SELECT F1.Tipo FROM Funcionarios F1 WHERE F1.CPF = "+ cpf; 
       db.query(query_busca_funcionario, [cpf], (err, resultado) =>{
            if (err) {
                message = "Não foi possivel achar o cargo do Funcionario";    
                dadosParaPagina.message = message;                    
                res.render('funcionarios.ejs', dadosParaPagina);
            }            
            cargo = resultado[0].Tipo;
            console.log("Identificado o Funcionario com Cargo =", cargo);

            /* Remover de acordo com o cargo */
            if(cargo === "Atendente"){
                var query = "DELETE FROM Atendente WHERE CPF_Atendente= ? "; 
                db.query(query, [cpf], (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel remover o Atendente";    
                        dadosParaPagina.message = message;                    
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }    
                    console.log("Removido o atendente com sucesso.");
                });
            }
            else if(cargo === "Freteiro"){
                var query = "DELETE FROM Freteiro WHERE CPF_Freteiro = ? ";
                db.query(query, [cpf], (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel remover o Freteiro";                       
                        dadosParaPagina.message = message;
                        console.log(err);
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }                    
                    console.log("Removido o freteiro com sucesso.");
                });
            }
            else if(cargo === "Supervisor"){
                var query = "DELETE FROM Supervisor WHERE CPF_Supervisor = ? or CPF_Supervisonado = ? ";   
                db.query(query, [cpf, cpf], (err, resultado) =>{
                    if (err) {
                        message = "Não foi possivel remover o Supervisor";                        
                        dadosParaPagina.message = message;
                        res.render('funcionarios.ejs', dadosParaPagina);
                    }                    
                    console.log("Removido o supervisor com sucesso.");
                });
            }

            var update_to_delete = "UPDATE Funcionarios SET CPF_Supervisor = NULL WHERE CPF = ? ";
            db.query(update_to_delete, [cpf], (err, resultado) =>{
                if (err) {
                    message = "Não foi possivel setar o supervisor do Funcionario como NULL";    
                    dadosParaPagina.message = message;                    
                    res.render('funcionarios.ejs', dadosParaPagina);
                } 
                console.log("Supervisor do Funcionario setado como NULL");
            });

            /* Se nao houve erro, remover o funcionario finalmente */
            var query_delete_funcionario = "DELETE FROM Funcionarios  WHERE CPF = ?"; 
            db.query(query_delete_funcionario, [cpf], (err, result) => {            
                if (err) {
                    message = "Não foi possivel remover o Funcionário";    
                    dadosParaPagina.message = message;              
                    console.log(err) ;
                    res.render('funcionarios.ejs', dadosParaPagina);            

                }
                console.log("Removido o funcionário com sucesso.");          
                res.redirect(url_list);           
            });

        });


    }
};