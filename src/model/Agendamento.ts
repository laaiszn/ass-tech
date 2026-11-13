import type AgendamentoDTO from "../dto/AgendamentoDTO.js";
import { DatabaseModel } from "./DataBaseModel.js";

const database = new DatabaseModel().pool;

class Agendamento {
    private id_agendamento: number = 0;
    private id_equipamento: number;
    private data_agendamento: Date;
    private descricao_servico: string;
    private status: string;

    constructor(
        _id_equipamento: number,
        _data_agendamento: Date,
        _descricao_servico: string,
        _status: string
    ) {
        this.id_equipamento = _id_equipamento;
        this.data_agendamento = _data_agendamento;
        this.descricao_servico = _descricao_servico;
        this.status = _status;
    }

    public getIdAgendamento(): number {
        return this.id_agendamento;
    }

    public setIdAgendamento(id_agendamento: number): void {
        this.id_agendamento = id_agendamento;
    }

    public getIdEquipamento(): number {
        return this.id_equipamento;
    }

    public setIdEquipamento(id_equipamento: number): void {
        this.id_equipamento = id_equipamento;
    }

    public getDataAgendamento(): Date {
        return this.data_agendamento;
    }

    public setDataAgendamento(data_agendamento: Date): void {
        this.data_agendamento = data_agendamento;
    }

    public getDescricaoServico(): string {
        return this.descricao_servico;
    }

    public setDescricaoServico(descricao_servico: string): void {
        this.descricao_servico = descricao_servico;
    }

    public getStatus(): string {
        return this.status;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    static async listarAgendamentos(): Promise<Array<AgendamentoDTO> | null> {
        const listaDeAgendamentos: Array<AgendamentoDTO> = [];

        try {
            const querySelectAgendamentos = `
                SELECT a.*, c.nome AS cliente_nome, e.tipo, e.marca, e.modelo
                FROM agendamento a
                JOIN equipamento e ON e.id_equipamento = a.id_equipamento
                JOIN cliente c ON c.id_cliente = e.id_cliente;
            `;
            const respostaBD = await database.query(querySelectAgendamentos);

            respostaBD.rows.forEach((agendamento: any) => {
                const agendamentoDTO: AgendamentoDTO = {
                    id_agendamento: Number(agendamento.id_agendamento),
                    id_equipamento: Number(agendamento.id_equipamento),
                    data_agendamento: agendamento.data_agendamento,
                    descricao_servico: agendamento.descricao_servico,
                    status: agendamento.status,
                    cliente_nome: agendamento.cliente_nome,
                    tipo: agendamento.tipo,
                    marca: agendamento.marca,
                    modelo: agendamento.modelo
                };

                listaDeAgendamentos.push(agendamentoDTO);
            });

            return listaDeAgendamentos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    static async listarAgendamento(id_agendamento: number): Promise<AgendamentoDTO | null> {
        try {
            const querySelectAgendamento = `
                SELECT a.*, c.nome AS cliente_nome, e.tipo, e.marca, e.modelo
                FROM agendamento a
                JOIN equipamento e ON e.id_equipamento = a.id_equipamento
                JOIN cliente c ON c.id_cliente = e.id_cliente
                WHERE a.id_agendamento = $1;
            `;
            const respostaBD = await database.query(querySelectAgendamento, [id_agendamento]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const agendamentoDTO: AgendamentoDTO = {
                id_agendamento: Number(respostaBD.rows[0].id_agendamento),
                id_equipamento: Number(respostaBD.rows[0].id_equipamento),
                data_agendamento: respostaBD.rows[0].data_agendamento,
                descricao_servico: respostaBD.rows[0].descricao_servico,
                status: respostaBD.rows[0].status,
                cliente_nome: respostaBD.rows[0].cliente_nome,
                tipo: respostaBD.rows[0].tipo,
                marca: respostaBD.rows[0].marca,
                modelo: respostaBD.rows[0].modelo
            };

            return agendamentoDTO;
        } catch (error) {
            console.log(`Erro ao realizar a consulta: ${error}`);
            return null;
        }
    }

    static async cadastrarAgendamento(agendamento: Agendamento): Promise<boolean> {
        try {
            const queryInsertAgendamento = `
                INSERT INTO agendamento (id_equipamento, data_agendamento, descricao_servico, status)
                VALUES ($1, $2, $3, $4)
                RETURNING id_agendamento;
            `;

            const result = await database.query(queryInsertAgendamento, [
                agendamento.getIdEquipamento(),
                agendamento.getDataAgendamento(),
                agendamento.getDescricaoServico(),
                agendamento.getStatus().toUpperCase()
            ]);

            if (result.rows.length > 0) {
                console.log(`Agendamento cadastrado com sucesso. ID: ${result.rows[0].id_agendamento}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar agendamento: ${error}`);
            return false;
        }
    }

    static async removerAgendamento(id_agendamento: number): Promise<boolean> {
        try {
            const queryDeleteAgendamento = `DELETE FROM agendamento WHERE id_agendamento = $1;`;
            const result = await database.query(queryDeleteAgendamento, [id_agendamento]);

            return result.rowCount !== 0;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }

    static async atualizarAgendamento(agendamento: Agendamento): Promise<boolean> {
        try {
            const queryAtualizarAgendamento = `
                UPDATE agendamento SET
                    id_equipamento = $1,
                    data_agendamento = $2,
                    descricao_servico = $3,
                    status = $4
                WHERE id_agendamento = $5;
            `;

            const respostaBD = await database.query(queryAtualizarAgendamento, [
                agendamento.getIdEquipamento(),
                agendamento.getDataAgendamento(),
                agendamento.getDescricaoServico(),
                agendamento.getStatus().toUpperCase(),
                agendamento.getIdAgendamento()
            ]);

            return respostaBD.rowCount !== 0;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }
}

export default Agendamento;