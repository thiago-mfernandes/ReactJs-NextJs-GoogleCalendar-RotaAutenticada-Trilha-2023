import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight, Check } from "phosphor-react"
import { Container, Header } from "../styles";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router";


export default function ConnectCalendar() {  
  //para ver se o usuario esta logado:
  const session = useSession();

  //pegar parametro de permissao negada pela usuario
  const router = useRouter();

  //a dupla negacao transforma em true ou false
  const hasAuthError = !!router.query.error


  const isSignedIn = session.status === 'authenticated'

  async function handleConnectCalendar(){
    await signIn('google');
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>    

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {
            isSignedIn ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleConnectCalendar} 
              >
                Conectar
                <ArrowRight />
              </Button>
            )
          }
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        {/**<Text>{JSON.stringify(session.data)}</Text>*/}

        <Button type="submit" disabled={!isSignedIn}>
          Próximo passo
          <ArrowRight />
        </Button>  
      </ConnectBox>

    </Container>
  )
}