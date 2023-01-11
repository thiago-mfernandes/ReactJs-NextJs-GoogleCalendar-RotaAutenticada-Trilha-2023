import { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
import { PrismaAdapter } from "../../../lib/auth/prisma-adapter"

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    // o prisma adapater contem todos os metodos para a persistencia de dados no BD
    adapter: PrismaAdapter(req, res),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
        }
      }),
    ],
    // callbacks sao funcoes chamadas em processos oportunos de autenticacao
    callbacks: {
      async signIn({ account }) {
        // se o usuario nao der permissao de acesso ao google agenda
        if(!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
          //o metodo signIn retorna true ou false
          
          //redirecionar para pagina de login com um query param - igual um retorno false
          return '/register/connect-calendar/?error=permissions'
        }
        //se o usuario deu permissao para o escopo de calendario, retorna true e a autenticacao flui normalmente
        return true
      },

      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      }
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res));
}

// caso a rota de um erro no terminal [next-auth][warn][NO_SECRET] ou ao fazer login a tora de um erro de callback na url: http://localhost:3000/api/auth/signin?error=OAuthCallback

// adiocionar um secret no .env com qualquer coisa dentro