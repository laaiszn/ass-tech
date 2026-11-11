import type ClienteDTO from "../dto/ClienteDTO.js";
import { DatabaseModel } from "./DataBaseModel.js";

const database = new DatabaseModel().pool;

class Cliente {
    private id_cliente: number = 0;
    private nome: string;
    private cpf: number;
    private email: string;
    private telefone: number;

    constructor(_nome: string, _cpf: number, _email: string, _telefone: number) {
        this.nome = _nome;
        this.cpf = _cpf;
        this.email = _email;
        this.telefone = _telefone;
    }

    public getIdCliente(): number {
        return this.id_cliente;
    }

    public setIdCliente(id_cliente: number): void {
        this.id_cliente = id_cliente;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getCpf(): number {
        return this.cpf;
    }

    public setCpf(cpf: number): void {
        this.cpf = cpf;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getTelefone(): number {
        return this.telefone;
    }

    public setTelefone(telefone: number): void {
        this.telefone = telefone;
    }

    static async listarClientes(): Promise<Array<ClienteDTO> | null> {
        const listaDeClientes: Array<ClienteDTO> = [];

        try {
            const querySelectClientes = `SELECT * FROM cliente;`;
            const respostaBD = await database.query(querySelectClientes);

            respostaBD.rows.forEach((cliente: any) => {
                const clienteDTO: ClienteDTO = {
                    id_cliente: cliente.id_cliente,
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    email: cliente.email,
                    telefone: cliente.telefone
                };

                listaDeClientes.push(clienteDTO);
            });

            return listaDeClientes;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    static async listarCliente(id_cliente: number): Promise<ClienteDTO | null> {
        try {
            const querySelectCliente = `SELECT * FROM cliente WHERE id_cliente = $1;`;
            const respostaBD = await database.query(querySelectCliente, [id_cliente]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const clienteDTO: ClienteDTO = {
                id_cliente: respostaBD.rows[0].id_cliente,
                nome: respostaBD.rows[0].nome,
                cpf: respostaBD.rows[0].cpf,
                email: respostaBD.rows[0].email,
                telefone: respostaBD.rows[0].telefone
            };

            return clienteDTO;
        } catch (error) {
            console.log(`Erro ao realizar a consulta: ${error}`);
            return null;
        }
    }

    static async cadastrarCliente(cliente: Cliente): Promise<boolean> {
        try {
            const queryInsertCliente = `
                INSERT INTO cliente (nome, cpf, email, telefone)
                VALUES ($1, $2, $3, $4)
                RETURNING id_cliente;
            `;

            const result = await database.query(queryInsertCliente, [
                cliente.getNome().toUpperCase(),
                cliente.getCpf(),
                cliente.getEmail().toLowerCase(),
                cliente.getTelefone()
            ]);

            if (result.rows.length > 0) {
                console.log(`Cliente cadastrado com sucesso. ID: ${result.rows[0].id_cliente}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar cliente: ${error}`);
            return false;
        }
    }

    static async removerCliente(id_cliente: number): Promise<boolean> {
        try {
            const queryDeleteCliente = `DELETE FROM cliente WHERE id_cliente = $1;`;
            const result = await database.query(queryDeleteCliente, [id_cliente]);

            return result.rowCount !== 0;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }

    static async atualizarCliente(cliente: Cliente): Promise<boolean> {
        try {
            const queryAtualizarCliente = `
                UPDATE cliente SET
                    nome = $1,
                    cpf = $2,
                    email = $3,
                    telefone = $4
                WHERE id_cliente = $5;
            `;

            const respostaBD = await database.query(queryAtualizarCliente, [
                cliente.getNome().toUpperCase(),
                cliente.getCpf(),
                cliente.getEmail().toLowerCase(),
                cliente.getTelefone(),
                cliente.getIdCliente()
            ]);

            return respostaBD.rowCount !== 0;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }
}

export default Cliente;