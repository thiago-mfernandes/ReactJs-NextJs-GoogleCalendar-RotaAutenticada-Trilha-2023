import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import { prisma } from '../../../lib/prisma';

// dentro do res eu tenho os cookies
// dentro do req eu posso modificar os cookies

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  // essa funcao aceita qualquer metodo
  if(req.method !== 'POST') {
    //metodo nao permitido pra essa rota, .end() envia uma mensagem sem corpo
    return res.status(405).end()
  }

  //pego de dentro do corpo da requisicao
  const { name, username } = req.body;

  //verificacao se o usuario ja existe, procurando por campos @unique
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if(userExists) {
    return res.status(400).json({ message: 'Usuário já existe. Insira outro nome.' })
  }

  const user = await prisma.user.create({
    //quais dados serao usados para criar:
    data: {
      name,
      username,
    },
  })

  //os cookies sao trafegados atraves dos cabecalhos de req/res
  //depois de ter criado o usuario
  // 1. passa a res para ter acesso ao cabecalho, passao um nome para o cookie e o valor
  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 34 * 7, // 7 days
    path: '/', //todas as rotas podem acessar esse cookie
  })


  return res.status(201).json(user)
}

