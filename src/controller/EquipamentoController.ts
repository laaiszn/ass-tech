import Equipamento from "../model/Equipamento.js";
import { type Request, type Response } from "express";
import type EquipamentoDTO from "../dto/EquipamentoDTO.js";

class EquipamentoController extends Equipamento {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeEquipamentos = await Equipamento.listarEquipamentos();
            res.status(200).json(listaDeEquipamentos);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações dos equipamentos.");
        }
    }

    static async equipamento(req: Request, res: Response) {
        try {
            const idEquipamento = parseInt(req.params.id as string);
            const equipamento = await Equipamento.listarEquipamento(idEquipamento);

            if (!equipamento) {
                return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
            }

            return res.status(200).json(equipamento);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            return res.status(500).json("Erro ao recuperar as informações do equipamento.");
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: EquipamentoDTO = req.body;

            const novoEquipamento = new Equipamento(
                dadosRecebidos.id_cliente,
                dadosRecebidos.tipo,
                dadosRecebidos.marca ?? '',
                dadosRecebidos.modelo ?? '',
                dadosRecebidos.numero_serie ?? ''
            );

            const result = await Equipamento.cadastrarEquipamento(novoEquipamento);

            if (result) {
                return res.status(201).json({ mensagem: 'Equipamento cadastrado com sucesso.' });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o equipamento no banco de dados.' });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o equipamento: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o equipamento.' });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idEquipamento = parseInt(req.params.id as string);
            const result = await Equipamento.removerEquipamento(idEquipamento);

            if (result) {
                return res.status(200).json({ mensagem: 'Equipamento removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Equipamento não encontrado para exclusão.' });
            }
        } catch (error) {
            console.log(`Erro ao remover equipamento: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao remover equipamento.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: EquipamentoDTO = req.body;

            const equipamento = new Equipamento(
                dadosRecebidos.id_cliente,
                dadosRecebidos.tipo,
                dadosRecebidos.marca ?? '',
                dadosRecebidos.modelo ?? '',
                dadosRecebidos.numero_serie ?? ''
            );

            equipamento.setIdEquipamento(parseInt(req.params.id as string));

            const result = await Equipamento.atualizarEquipamento(equipamento);

            if (result) {
                return res.status(200).json({ mensagem: 'Equipamento atualizado com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Equipamento não encontrado para atualização.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar equipamento: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao atualizar equipamento.' });
        }
    }
}

export default EquipamentoController;