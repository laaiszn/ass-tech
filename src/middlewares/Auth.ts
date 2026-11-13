import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import { DatabaseModel } from '../model/DataBaseModel.js';

// pool de conexão ao banco de dados
const database = new DatabaseModel().pool;

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET não está configurada.");
    }
    return secret;
}

/**
 * Interface para representar um Payload do JWT
 */
interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    role: string;
    exp: number;
}

/**
 * Gera e trata um token de autenticação para o sistema
 */
export class Auth {

    /**
     * Valida as credenciais do usuário no banco de dados
     * @param req Requisição com as informações do usuário
     * @param res Resposta enviada a quem requisitou o login
     * @returns Token de autenticação caso o usuário seja válido, mensagem de login não autorizado caso negativo
     */
    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        // recupera informações do corpo da requisição
        const { email, senha } = req.body;

        // query para validar email e senha informados pelo cliente
        try {
            // faz a requisição ao banco de dados
            const querySelectUser = `
                SELECT id_usuario, nome, email, role
                FROM usuario
                WHERE email = $1 AND senha = crypt($2, senha);
            `;
            const queryResult = await database.query(querySelectUser, [email, senha]);

            if (queryResult.rowCount !== 0) {
                const usuario = {
                    id_usuario: queryResult.rows[0].id_usuario,
                    nome: queryResult.rows[0].nome,
                    email: queryResult.rows[0].email,
                    role: queryResult.rows[0].role
                }

                const tokenUsuario = Auth.generateToken(usuario.id_usuario, usuario.nome, usuario.email, usuario.role);

                return res.status(200).json({ auth: true, token: tokenUsuario, usuario: usuario });
            } else {
                return res.status(401).json({ auth: false, token: null, message: "E-mail e/ou senha incorretos" });
            }
        } catch (error) {
            console.log(`Erro no modelo: ${error}`);
            if (error instanceof Error && error.message === "JWT_SECRET não está configurada.") {
                return res.status(500).json({ message: "Autenticação não configurada no servidor." });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    /**
     * Gera token de validação do usuário
     * 
     * @param id ID do usuário no banco de dados
     * @param nome Nome do usuário no banco de dados
     * @param email Email do usuário no banco de dados
     * @param role Role do usuário no banco de dados
     * @returns Token de autenticação do usuário
     */
    static generateToken(id: number, nome: string, email: string, role: string) {
        return jwt.sign({ id, nome, email, role }, getJwtSecret(), { expiresIn: '1h' });
    }

    /**
     * Verifica o token do usuário para saber se ele é válido
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            console.log('Token não informado');
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        let secret: string;
        try {
            secret = getJwtSecret();
        } catch (error) {
            console.error(`Erro na configuração de autenticação: ${error}`);
            return res.status(500).json({ message: "Autenticação não configurada no servidor." });
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expirado');
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
                } else {
                    console.log('Token inválido.');
                    return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
                }
            }

            if (!decoded) {
                console.log('Token não pôde ser decodificado');
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            const { exp, id } = decoded as JwtPayload;

            if (!exp || !id) {
                console.log('Data de expiração ou ID não encontrada no token');
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > exp) {
                console.log('Token expirado');
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
            }

            req.headers['userId'] = String(id);
            next();
        });
    }
}