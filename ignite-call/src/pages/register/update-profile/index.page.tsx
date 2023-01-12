import { Button, Heading, MultiStep, Text, TextArea } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { ArrowRight } from "phosphor-react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormAnnotation, ProfileBox } from "./styles";


const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {

  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  

  async function handleUpdateProfile(data: UpdateProfileData){
    
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem vindo ao gnite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Foto de perfil</Text>
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register('bio')} /> 
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>         
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}
