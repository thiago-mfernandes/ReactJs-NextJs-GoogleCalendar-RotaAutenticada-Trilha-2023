import { Button, TextInput, Text } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./styles";
import { zodResolver } from '@hookform/resolvers/zod'
import { FormAnnotation } from "../../home/styles";

// esquema de validacao e declaracao do que vai ser recebido no formulario
const claimUsernameFormSchema = z.object({
  username: z.string()
    // posso passar qual eh o parametro a verificar e o segundo parametro a mensagem de erro
    .min(3, { message: 'Digite um nome com no mínimo de 3 letras' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Usuário pode ter apenas letras e hífen.' })
    .transform(username => username.toLowerCase()),
})

// inferencia do tipo do formulario
type claimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;


export function ClaimUsernameForm() {
  // desestruturacao das funcoes e passagem de objeto resolver
  const { register, handleSubmit, formState: { errors } } = useForm<claimUsernameFormData>({
    //zod resolver recebe qual Schema de validacao vai validar
    resolver: zodResolver(claimUsernameFormSchema),
  });

  async function handleClaimUsername(data: claimUsernameFormData) {
    console.log(data);
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username ? errors.username.message : 'Digite o nome do usuário desejado' }
        </Text>
      </FormAnnotation>
    </>
  )
}