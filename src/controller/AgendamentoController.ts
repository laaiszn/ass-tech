import Agendamento from "../model/Agendamento.js";
import { type Request, type Response } from "express";
import type AgendamentoDTO from "../dto/AgendamentoDTO.js";

class AgendamentoController extends Agendamento {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeAgendamentos = await Agendamento.listarAgendamentos();
            res.status(200).json(listaDeAgendamentos);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações dos agendamentos.");
        }
    }

    static async agendamento(req: Request, res: Response) {
        try {
            const idAgendamento = req.params.id as string;
            const agendamento = await Agendamento.listarAgendamento(idAgendamento);

            if (!agendamento) {
                return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
            }

            return res.status(200).json(agendamento);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            return res.status(500).json("Erro ao recuperar as informações do agendamento.");
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: AgendamentoDTO = req.body;

            const novoAgendamento = new Agendamento(
                dadosRecebidos.id_equipamento,
                dadosRecebidos.data_agendamento ?? new Date(),
                dadosRecebidos.descricao_servico ?? '',
                dadosRecebidos.status ?? 'PENDENTE'
            );

            const result = await Agendamento.cadastrarAgendamento(novoAgendamento);

            if (result) {
                return res.status(201).json({ mensagem: 'Agendamento cadastrado com sucesso.' });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o agendamento no banco de dados.' });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o agendamento: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o agendamento.' });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idAgendamento = req.params.id as string;
            const result = await Agendamento.removerAgendamento(idAgendamento);

            if (result) {
                return res.status(200).json({ mensagem: 'Agendamento removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Agendamento não encontrado para exclusão.' });
            }
        } catch (error) {
            console.log(`Erro ao remover agendamento: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao remover agendamento.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: AgendamentoDTO = req.body;

            const agendamento = new Agendamento(
                dadosRecebidos.id_equipamento,
                dadosRecebidos.data_agendamento ?? new Date(),
                dadosRecebidos.descricao_servico ?? '',
                dadosRecebidos.status ?? 'PENDENTE'
            );

            agendamento.setIdAgendamento(req.params.id as string);

            const result = await Agendamento.atualizarAgendamento(agendamento);

            if (result) {
                return res.status(200).json({ mensagem: 'Agendamento atualizado com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Agendamento não encontrado para atualização.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar agendamento: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao atualizar agendamento.' });
        }
    }
}

export default AgendamentoController;     