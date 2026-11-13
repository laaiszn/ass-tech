import type EquipamentoDTO from "../dto/EquipamentoDTO.js";
import { DatabaseModel } from "./DataBaseModel.js";

const database = new DatabaseModel().pool;

class Equipamento {
    private id_equipamento: number = 0;
    private id_cliente: number;
    private tipo: string;
    private marca: string;
    private modelo: string;
    private numero_serie: string;

    constructor(
        _id_cliente: number,
        _tipo: string,
        _marca: string,
        _modelo: string,
        _numero_serie: string
    ) {
        this.id_cliente = _id_cliente;
        this.tipo = _tipo;
        this.marca = _marca;
        this.modelo = _modelo;
        this.numero_serie = _numero_serie;
    }

    public getIdEquipamento(): number {
        return this.id_equipamento;
    }

    public setIdEquipamento(id_equipamento: number): void {
        this.id_equipamento = id_equipamento;
    }

    public getIdCliente(): number {
        return this.id_cliente;
    }

    public setIdCliente(id_cliente: number): void {
        this.id_cliente = id_cliente;
    }

    public getTipo(): string {
        return this.tipo;
    }

    public setTipo(tipo: string): void {
        this.tipo = tipo;
    }

    public getMarca(): string {
        return this.marca;
    }

    public setMarca(marca: string): void {
        this.marca = marca;
    }

    public getModelo(): string {
        return this.modelo;
    }

    public setModelo(modelo: string): void {
        this.modelo = modelo;
    }

    public getNumeroSerie(): string {
        return this.numero_serie;
    }

    public setNumeroSerie(numero_serie: string): void {
        this.numero_serie = numero_serie;
    }

    static async listarEquipamentos(): Promise<Array<EquipamentoDTO> | null> {
        const listaDeEquipamentos: Array<EquipamentoDTO> = [];

        try {
            const querySelectEquipamentos = `
                SELECT e.*, c.nome AS cliente_nome
                FROM equipamento e
                JOIN cliente c ON c.id_cliente = e.id_cliente;
            `;
            const respostaBD = await database.query(querySelectEquipamentos);

            respostaBD.rows.forEach((equipamento: any) => {
                const equipamentoDTO: EquipamentoDTO = {
                    id_equipamento: equipamento.id_equipamento,
                    id_cliente: equipamento.id_cliente,
                    cliente_nome: equipamento.cliente_nome,
                    tipo: equipamento.tipo,
                    marca: equipamento.marca,
                    modelo: equipamento.modelo,
                    numero_serie: equipamento.numero_serie
                };

                listaDeEquipamentos.push(equipamentoDTO);
            });

            return listaDeEquipamentos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    static async listarEquipamento(id_equipamento: number): Promise<EquipamentoDTO | null> {
        try {
            const querySelectEquipamento = `
                SELECT e.*, c.nome AS cliente_nome
                FROM equipamento e
                JOIN cliente c ON c.id_cliente = e.id_cliente
                WHERE e.id_equipamento = $1;
            `;
            const respostaBD = await database.query(querySelectEquipamento, [id_equipamento]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const equipamentoDTO: EquipamentoDTO = {
                id_equipamento: respostaBD.rows[0].id_equipamento,
                id_cliente: respostaBD.rows[0].id_cliente,
                cliente_nome: respostaBD.rows[0].cliente_nome,
                tipo: respostaBD.rows[0].tipo,
                marca: respostaBD.rows[0].marca,
                modelo: respostaBD.rows[0].modelo,
                numero_serie: respostaBD.rows[0].numero_serie
            };

            return equipamentoDTO;
        } catch (error) {
            console.log(`Erro ao realizar a consulta: ${error}`);
            return null;
        }
    }

    static async cadastrarEquipamento(equipamento: Equipamento): Promise<boolean> {
        try {
            const queryInsertEquipamento = `
                INSERT INTO equipamento (id_cliente, tipo, marca, modelo, numero_serie)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_equipamento;
            `;

            const result = await database.query(queryInsertEquipamento, [
                equipamento.getIdCliente(),
                equipamento.getTipo().toUpperCase(),
                equipamento.getMarca().toUpperCase(),
                equipamento.getModelo().toUpperCase(),
                equipamento.getNumeroSerie().toUpperCase()
            ]);

            if (result.rows.length > 0) {
                console.log(`Equipamento cadastrado com sucesso. ID: ${result.rows[0].id_equipamento}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar equipamento: ${error}`);
            return false;
        }
    }

    static async removerEquipamento(id_equipamento: number): Promise<boolean> {
        try {
            const queryDeleteEquipamento = `DELETE FROM equipamento WHERE id_equipamento = $1;`;
            const result = await database.query(queryDeleteEquipamento, [id_equipamento]);

            return result.rowCount !== 0;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }

    static async atualizarEquipamento(equipamento: Equipamento): Promise<boolean> {
        try {
            const queryAtualizarEquipamento = `
                UPDATE equipamento SET
                    id_cliente = $1,
                    tipo = $2,
                    marca = $3,
                    modelo = $4,
                    numero_serie = $5
                WHERE id_equipamento = $6;
            `;

            const respostaBD = await database.query(queryAtualizarEquipamento, [
                equipamento.getIdCliente(),
                equipamento.getTipo().toUpperCase(),
                equipamento.getMarca().toUpperCase(),
                equipamento.getModelo().toUpperCase(),
                equipamento.getNumeroSerie().toUpperCase(),
                equipamento.getIdEquipamento()
            ]);

            return respostaBD.rowCount !== 0;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }
}

export default Equipamento;