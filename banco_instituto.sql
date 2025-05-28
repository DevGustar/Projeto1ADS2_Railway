 
CREATE DATABASE banco_instituto;
USE banco_instituto;


/*FUNÇÃO PARA MOSTRAR TODAS AS TABELAS*/
SHOW TABLES;

/*CRIAÇÃO DA TABELA USUÁRIO*/
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome_usuario VARCHAR(255) NOT NULL,
    sobrenome_usuario VARCHAR(255) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    email VARCHAR(255) NOT NULL
);
/*MOSTRA DADOS DA TABELA USUÁRIO*/
SELECT * FROM usuario;
/*MOSTRAR A ESTRUTURA DA TABELA USUÁRIO*/
DESCRIBE usuario;


/*CRIAÇÃO DA TABELA ADMINSTRADOR*/
CREATE TABLE adm (
    id_adm INT PRIMARY KEY AUTO_INCREMENT,
    nome_adm VARCHAR(255) NOT NULL,
    email_adm varchar(100) NOT NULL,
    sobrenome_adm VARCHAR(255) NOT NULL,
    cpf_adm VARCHAR(14) UNIQUE NOT NULL,
    atuacao_adm VARCHAR(50) NOT NULL,
    cargo_adm VARCHAR(100) NOT NULL,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
	senha varchar(25) NOT NULL,
    cep_empresa VARCHAR(8) UNIQUE NOT NULL
);

select * from adm;



INSERT INTO adm (
    nome_adm,
    sobrenome_adm,
    cpf_adm,
    atuacao_adm,
    cargo_adm,
    nome_empresa,
    cnpj,
    cep_empresa
) VALUES (
    'Lucas',
    'Silva',
    '123.456.789-00',
    'Organização de Eventos',
    'Coordenador de Projetos',
    'Instituto Criativo',
    '12345678000199',
    '01234000'
);






/*MOSTRA DADOS DA TABELA ADMINISTRADOR*/
SELECT * FROM adm;
/*MOSTRAR A ESTRUTURA DA TABELA ADMINISTRADOR*/
DESCRIBE adm;


/*CRIAÇÃO DA TABELA EVENTOS*/
CREATE TABLE eventos (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    id_adm INT UNIQUE,
	tipo varchar(10) NOT NULL,
    nome_evento VARCHAR(255) NOT NULL,
    preco DECIMAL NOT NULL,
    data_hora DATETIME NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    descricao TEXT,
    organizadores VARCHAR(255),
    FOREIGN KEY (id_adm) REFERENCES adm(id_adm) ON DELETE SET NULL
);
alter table eventos add column qtd_ingressoes int(32) NOT NULL default 20;
alter table eventos add column avaliacao int(5) NOT NULL default 3.5;



INSERT INTO eventos (
    id_adm,
    tipo,
    nome_evento,
    preco,
    data_hora,
    endereco,
    descricao,
    organizadores
) VALUES (
    6,
    'Doação',
    'Evento DoaçãoTerapia2',
    50.00,
    '2025-06-15 19:30:00',
    'Av. Paulista, 1000 - São Paulo',
    'Uma palestra sobre técnicas de atenção plena e seu impacto no bem-estar emocional.',
    'Instituto Criativo'
);



update eventos set qtd_ingressoes = 27 where id_evento = '3';





/*MOSTRA DADOS DA TABELA EVENTOS*/
SELECT * FROM eventos;
/*MOSTRAR A ESTRUTURA DA TABELA EVENTOS*/
DESCRIBE eventos;


/*CRIAÇÃO DA TABELA IMAGENS*/
CREATE TABLE imagens (
    id_imagem INT PRIMARY KEY AUTO_INCREMENT,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho_imagem VARCHAR(255) NOT NULL,
    upload_imagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_imagem VARCHAR(50)
);
/*MOSTRA DADOS DA TABELA IMAGENS*/
SELECT * FROM imagens;
/*MOSTRAR A ESTRUTURA DA TABELA IMAGENS*/
DESCRIBE imagens;