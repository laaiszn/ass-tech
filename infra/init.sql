CREATE EXTENSION IF NOT EXISTS pgcrypto; --senha hash

DROP TABLE IF EXISTS agendamento CASCADE;
DROP TABLE IF EXISTS equipamento CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;



CREATE TABLE usuario (
id_usuario SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(120) NOT NULL UNIQUE,
senha VARCHAR(100) NOT NULL
);


CREATE TABLE cliente (
id_cliente SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
 cpf VARCHAR(11) UNIQUE NOT NULL,
email VARCHAR(120) NOT NULL,
telefone VARCHAR(20) NOT NULL
);


CREATE TABLE equipamento (
id_equipamento SERIAL PRIMARY KEY,
id_cliente INTEGER NOT NULL REFERENCES cliente (id_cliente) ON DELETE CASCADE,
tipo VARCHAR(50) NOT NULL,
marca VARCHAR(50) NOT NULL,
modelo VARCHAR(50) NOT NULL,
numero_serie VARCHAR(60) UNIQUE NOT NULL 
);


CREATE TABLE agendamento (
id_agendamento SERIAL PRIMARY KEY,
id_equipamento INTEGER NOT NULL REFERENCES equipamento (id_equipamento) ON DELETE CASCADE,
data_agendamento DATE NOT NULL,
descricao_servico VARCHAR(255) NOT NULL,
status VARCHAR(20) NOT NULL DEFAULT 'AGENDADO'
);




INSERT INTO usuario (nome, email, senha_hash) VALUES
('Administrador', 'admin@assistec.com', 'admin123'),
('Carlos Técnico', 'carlos@assistec.com','tecnico123'),
('Ana Atendente', 'ana@assistec.com', 'atendente123');


INSERT INTO cliente (nome, cpf, email, telefone) VALUES
('Mariana Souza','52998224725', 'mariana@email.com', '(17) 99111-1111'),
('João Pereira', '11144477735', 'joao@email.com', '(17) 99222-2222'),
('Fernanda Lima','39053344705', 'fernanda@email.com','(17) 99333-3333');


INSERT INTO equipamento (id_cliente, tipo, marca, modelo, numero_serie) VALUES
(1, 'Notebook', 'Dell', 'Inspiron 15', 'DL-2024-0001'),               
(2, 'Smartphone', 'Samsung', 'Galaxy S21', 'SM-2023-0420'),
(3, 'Televisão', 'LG', 'OLED 55', 'LG-2022-7788'),
(1, 'Impressora', 'HP', 'LaserJet 107','HP-2021-3344');

INSERT INTO agendamento (id_equipamento, data_agendamento, descricao_servico, status) VALUES
(1, '2026-11-25', 'Troca de teclado e limpeza interna', 'AGENDADO'),
(2, '2026-11-18', 'Substituição de tela', 'AGENDADO'),
(3, '2026-12-02', 'Diagnóstico de falha de imagem', 'AGENDADO'),
(4, '2026-11-20', 'Troca de cilindro', 'AGENDADO');

