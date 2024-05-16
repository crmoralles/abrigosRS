import express from "express";
import z from "zod";

import { Birthdate } from "../../entities/value-objects/birthdate";

import { serproProvider } from "../providers/serpro-provider";
import { authenticateRequest } from "./authorization-middleware";

export const router = express.Router();

router.use(express.json());
router.use(authenticateRequest);

router.get("/pessoas/:cpf", async (req, res) => {
  try {
    if (!z.string().regex(/^\d+$/).safeParse(req.params.cpf).success) {
      return res.status(400).send("Caracteres inválidos no CPF.");
    }

    const dataFromCPF = await serproProvider.consultCPF(req.params.cpf);

    let nascimento;
    try {
      nascimento = Birthdate.createFromText(dataFromCPF.nascimento).value;
    } catch (err: any) {
      throw new Error("Erro na data retornada pela Serpro: " + err.message);
    }

    return res
      .status(200)
      .send({ 
        nome: dataFromCPF.nome, 
        nascimento: nascimento, 
        situacaoCodigo: dataFromCPF.situacaoCodigo, 
        situacaoDescricao: dataFromCPF.situacaoDescricao });
  } catch (err: any) {
    if (!err.response) {
      console.error(err);
      return res.status(500).send("Erro inesperado, contate o suporte.");
    }

    return res
      .status(err.response.status || 500)
      .send(err.response.data.mensagem);
  }
});
