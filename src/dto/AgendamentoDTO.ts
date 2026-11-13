export default interface AgendamentoDTO {
    id_agendamento: number,
    id_equipamento: number,
    data_agendamento: Date,
    descricao_servico: string,
    status: string,
    cliente_nome: string,
    tipo: string,
    marca: string,
    modelo: string
}
