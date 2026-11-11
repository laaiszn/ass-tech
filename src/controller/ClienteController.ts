import Cliente from "../model/Cliente.js";
import { type Request, type Response } from "express";
import type ClienteDTO from "../dto/ClienteDTO.js";

class ClienteController extends Cliente {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeClientes = await Cliente.listarClientes();
            res.status(200).json(listaDeClientes);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações dos clientes.");
        }
    }

    static async cliente(req: Request, res: Response) {
        try {
            const idCliente = parseInt(req.params.id as string);
            const cliente = await Cliente.listarCliente(idCliente);

            if (!cliente) {
                return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
            }

            return res.status(200).json(cliente);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            return res.status(500).json("Erro ao recuperar as informações do cliente.");
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: ClienteDTO = req.body;

            const novoCliente = new Cliente(
                dadosRecebidos.nome,
                dadosRecebidos.cpf,
                dadosRecebidos.email ?? '',
                dadosRecebidos.telefone
            );

            const result = await Cliente.cadastrarCliente(novoCliente);

            if (result) {
                return res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso.' });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o cliente no banco de dados.' });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o cliente: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o cliente.' });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idCliente = parseInt(req.params.id as string);
            const result = await Cliente.removerCliente(idCliente);

            if (result) {
                return res.status(200).json({ mensagem: 'Cliente removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Cliente não encontrado para exclusão.' });
            }
        } catch (error) {
            console.log(`Erro ao remover cliente: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao remover cliente.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: ClienteDTO = req.body;

            const cliente = new Cliente(
                dadosRecebidos.nome,
                dadosRecebidos.cpf,
                dadosRecebidos.email ?? '',
                dadosRecebidos.telefone
            );

            cliente.setIdCliente(parseInt(req.params.id as string));

            const result = await Cliente.atualizarCliente(cliente);

            if (result) {
                return res.status(200).json({ mensagem: 'Cadastro atualizado com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Cliente não encontrado para atualização.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar cliente: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao atualizar cliente.' });
        }
    }
}

export default ClienteController;