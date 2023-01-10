import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  // toda vez que um comando sql for executado, será logado no terminal
  log: ['query'],
});

// o prisma entende como fazer a conexao com o bd atraves do arquivo .env