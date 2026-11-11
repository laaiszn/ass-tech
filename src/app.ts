
import { server } from "./server.js";
import dotenv from "dotenv";
import { DatabaseModel } from "./model/DataBaseModel.js";

dotenv.config();

/**
 * Configuração da porta do servidor
 */
const port = Number(process.env.SERVER_PORT || 3000);

/**
 * Inicia o servidor após a verificação de conexão com o banco de dados
 */
new DatabaseModel().testeConexao().then((resbd) => {
    console.clear();

    if (resbd) {
        server.listen(port, () => {
            console.info(
                `Servidor executando no endereço http://localhost:${port}/`
            );
        });
    } else {
        console.log("Não foi possível conectar ao banco de dados");
    }
}).catch((error) => {
    console.error("Erro ao conectar com o banco de dados:", error);
});
