DROP DATABASE IF EXISTS Agropec;
CREATE DATABASE IF NOT EXISTS Agropec;

CREATE USER 'agropec.admin'@'localhost' IDENTIFIED BY 'admin'; 
ALTER USER 'agropec.admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin'; 
GRANT ALL PRIVILEGES ON Agropec.* TO 'agropec.admin'@'localhost';

use Agropec;

DROP TABLE IF EXISTS QTDE_Vendida;
DROP TABLE IF EXISTS Vendas;
DROP TABLE IF EXISTS Produtos;
DROP TABLE IF EXISTS Fornecedor;
DROP TABLE IF EXISTS Categoria;
DROP TABLE IF EXISTS Freteiro;
DROP TABLE IF EXISTS Atendente;
DROP TABLE IF EXISTS Supervisor;
DROP TABLE IF EXISTS Funcionarios;
DROP TABLE IF EXISTS Telefone_Cliente;
DROP TABLE IF EXISTS Telefones;
DROP TABLE IF EXISTS Estancia;
DROP TABLE IF EXISTS Clientes;
 
CREATE TABLE Clientes(
	CPF CHAR(11) PRIMARY KEY,
    Nome VARCHAR(155)    
);

CREATE TABLE Estancia(
	Nome_Estancia VARCHAR(155) PRIMARY KEY,
    CPF_propietario CHAR(11),
	Referencia VARCHAR(155),
    
    FOREIGN KEY (CPF_propietario) REFERENCES Clientes(CPF)
);

 CREATE TABLE Telefones(
	Numero VARCHAR(15) PRIMARY KEY
 );
 
 CREATE TABLE Telefone_Cliente(
	Num_Telefone VARCHAR(15),
    CPF_Cliente CHAR(11),
    
    PRIMARY KEY (Num_Telefone,CPF_Cliente),
    FOREIGN KEY (Num_Telefone) REFERENCES Telefones(Numero),
    FOREIGN KEY (CPF_Cliente) REFERENCES Clientes(CPF)
 );
 
 CREATE TABLE Funcionarios(
	CPF CHAR(11) PRIMARY KEY NOT NULL,
    Nome VARCHAR(155),
    Tipo VARCHAR(50),
    CPF_Supervisor CHAR(11),
    FOREIGN KEY (CPF_Supervisor) REFERENCES Funcionarios(CPF)
 );
 
CREATE TABLE Supervisor(
	CPF_Supervisor CHAR(11),
    CPF_Supervisionado CHAR(11),
    
    PRIMARY KEY (CPF_Supervisor, CPF_Supervisionado),
    FOREIGN KEY (CPF_Supervisor) REFERENCES Funcionarios(CPF),
    FOREIGN KEY (CPF_Supervisionado) REFERENCES Funcionarios(CPF)
);

CREATE TABLE Atendente(
	CPF_Atendente CHAR(11) PRIMARY KEY,
    Nro_Vendas INTEGER,
    
    FOREIGN KEY (CPF_Atendente) REFERENCES Funcionarios(CPF)
);

CREATE TABLE Freteiro(
	CPF_Freteiro CHAR(11) PRIMARY KEY,
    Nro_Entregas INTEGER,
    
    FOREIGN KEY (CPF_Freteiro) REFERENCES Funcionarios(CPF)
);

CREATE TABLE Categoria(
	ID INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(155),
    Descricao VARCHAR(255)
);


CREATE TABLE Fornecedor(
		ID INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Nome VARCHAR(155),
        Tel VARCHAR(15)
);


CREATE TABLE Produtos(
	Codigo INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(155),
    Preco REAL,
    Descricao VARCHAR(255),
    ID_categoria INTEGER NOT NULL,
    ID_fornecedor INTEGER NOT NULL,
    QTD_Estoque INTEGER,
    
    FOREIGN KEY (ID_categoria) REFERENCES Categoria(ID),
    FOREIGN KEY (ID_fornecedor) REFERENCES Fornecedor(ID)
);




CREATE TABLE Vendas(
	Codigo INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    CPF_cliente CHAR(11),
    CPF_atendente CHAR(11),
    CPF_freteiro CHAR(11),
    Tel_cliente VARCHAR(15),
    
    FOREIGN KEY (CPF_cliente) REFERENCES Clientes(CPF),
    FOREIGN KEY (CPF_atendente) REFERENCES Atendente(CPF_Atendente),
    FOREIGN KEY (CPF_freteiro) REFERENCES Freteiro(CPF_Freteiro)
    
);
 
 CREATE TABLE QTDE_Vendida(
	Cod_produto INTEGER,
    Cod_venda INTEGER,
    Dia_venda DATE,
    Qtde INTEGER,
    
    PRIMARY KEY (Cod_produto,Cod_venda),
    FOREIGN KEY (Cod_produto) REFERENCES Produtos(Codigo),
    FOREIGN KEY (Cod_venda) REFERENCES Vendas(Codigo))
    