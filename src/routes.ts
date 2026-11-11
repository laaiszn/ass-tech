// routes.ts
import { Router } from "express";
import ClienteController from "./controller/ClienteController.js";
import EquipamentoController from "./controller/EquipamentoController.js";
import AgendamentoController from "./controller/AgendamentoController.js";

const router = Router();

// Clientes
router.get("/clientes", ClienteController.todos);
router.get("/cliente/:id", ClienteController.cliente);
router.post("/cliente", ClienteController.cadastrar);
router.put("/cliente/:id", ClienteController.atualizar);
router.delete("/cliente/:id", ClienteController.remover);

// Equipamentos
router.get("/equipamentos", EquipamentoController.todos);
router.get("/equipamento/:id", EquipamentoController.equipamento);
router.post("/equipamento", EquipamentoController.cadastrar);
router.put("/equipamento/:id", EquipamentoController.atualizar);
router.delete("/equipamento/:id", EquipamentoController.remover);

// Agendamentos
router.get("/agendamentos", AgendamentoController.todos);
router.get("/agendamento/:id", AgendamentoController.agendamento);
router.post("/agendamento", AgendamentoController.cadastrar);
router.put("/agendamento/:id", AgendamentoController.atualizar);
router.delete("/agendamento/:id", AgendamentoController.remover);

export { router };