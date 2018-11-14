## Projeto de Banco de Dados



Objetivo do CRUD: Realizar as operaçoes no banco de dados

CRUD dos modelos
Create
Retrieve ( List, Detail)
Update
Delete

List -> Listagem geral de todos os registros do Modelo
Detail -> Listagem de um unico registro do Modelo por um campo especifico

Ex: 
List Fornecedores -> Retornar todos os fornecedores que existem no modelo no BD
Detail Fornecedores -> Retornar um unico forcedor buscando por alguma chave (pode ser por PK)


REST HTTP 

Status Code Http
200 -> sucesso
404 -> nao encontrou
400 -> cliente mandou argumentos invalido
500 -> servidor com erro

RESTful

GET -> Retrive 
	GET /fornecedor -> Buscar info de todos os fornecedores
	GET /cliente/?nome=natasha -> Buscar info de todos os fornecedores
SELECT * FROM CLIENTE WHERE NOME LIKE '%natasha%'


	GET /fornecedor/23/ -> Busca info do fornecedor de ID=23
SELECT * FROM CLIENTE WHERE ID=353623598652

POST -> Create
	POST /fornecedor
	     body-> (Rafael, 999525285) - Criar o registro do Fornecedor Rafael (Telefone, Nome, ID)
	     retorno -> (23, Rafael, 999525285) 

PUT -> Update
	PUT /fornecedor/23/
	    body-> (Rafael Santos, 999525285) - Alterar o registro do Rafael

PATCH -> Update Partial Fields -> Alteracao de parte do dado
	PATCH /fornecedor/23
	body -> (Rafael Santos)

DELETE -> Delete
	DELETE /fornecedor/23/ -> apagar o registro 23