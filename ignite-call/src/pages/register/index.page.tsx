import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "../../lib/axios";
import { AxiosError } from "axios";


const registerFormSchema = z.object({
  username: 
    z.string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'O usuário pode ter apenas letras e hífens.' })
    .transform((username) => username.toLocaleLowerCase()),
  name:
    z.string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
  })

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    // esse setValue serve pra setar um campo do formulario de maneira manual
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  //se na URL o parametro for trocado, o useEffect vai ser chamado
  useEffect(() => {
    // se houver um parametro passado pela rota
    if(router.query.username) {
      // setar o campo 'username' com o valor router.query
      //precisa converter de array pra string
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])


  async function handleRegister(data: RegisterFormData){
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username
      })

      // depois que o usuario for criado, redireciona-lo
      await router.push('/register/connect-calendar')
    } catch (err) {
      if(err instanceof AxiosError && err.response?.data?.message) {
        alert(err.response.data.message)
        return;
      }
      console.log(err)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem vindo ao gnite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome do usuário</Text>
          <TextInput prefix="ignite.com/" placeholder="seu-usuario" {...register('username')}/>
          {errors.username && (
            <FormError size="sm" >{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')}/>
          {errors.name && (
            <FormError size="sm" >{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}