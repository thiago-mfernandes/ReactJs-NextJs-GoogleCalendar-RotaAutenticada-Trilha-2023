// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: 'John Doe' })
}

//configuracao da ferramenta de comunicacao com o banco de dados
// npm i prisma -D
// npm i @prisma/client

//iniciar npx prisma init --datasource-provider SQLite
