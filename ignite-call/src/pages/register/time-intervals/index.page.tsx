import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { FormError, IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer } from "./styles";
import { ArrowRight } from "phosphor-react"
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "../../../utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "../../../utils/convert-time-string-to-minutes";
import { api } from "../../../lib/axios";


const timeIntervalsFormSchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number().min(0).max(6),
      enabled: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    })
  )
  .length(7) // o tamanho do array precisa ser sempre 7
  .transform((intervals) => intervals.filter((interval) => interval.enabled)) // recebe o array original de intervalos e filtra o array para devolver apenas os dias enabled
  .refine((intervals) => intervals.length > 0, { message: 'Você precisa selecionar pelo menos um dia da semana!'}) //retorna um true ou false, o array eh valido ou nao. No caso, um dia da semana precisa haver atendimento para prosseguir no formulario
  .transform((intervals) => {
    // vou percorrer cada intervalo e retornar um novo objeto
    return intervals.map((interval) => {
      return {
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        // nao preciso mais de enabled, porque sao dias sem nenhum agendamento
      }
    })
  })
  .refine(intervals => {
    // vou verificar se todos - every - cumprem: se em cada intervalo, horario final - 60 é maior que o horario de inicio em minutos
    return intervals.every(interval => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes)
  }, { message: 'O horário de término deve ser pelo menos 1h distante do início.' })
  , 
})

// os dados antes das validacoes entram em um formato
type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
// e apos a validacao e transformacao saem em outro formato
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>


export default function TimeIntervals() {  

  /**
   * [
   *  { day: 0, start: time, end: time },
   *  { day: 1, start: time, end: time },
   *  { day: 2, start: time, end: time },
   *  { day: 3, start: time, end: time },
   *  { day: 4, start: time, end: time },
   *  { day: 5, start: time, end: time },
   *  { day: 6, start: time, end: time },
   * ]
   * 
   *  Para cada dia da semana, eu tenho um objeto 
   *  Tenho um campo dentro do meu formulario que é um array
   */
  
  const {
    register,
    handleSubmit,
    formState: {
      isSubmitting, errors
    },
    control,
    watch
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    // habilito neste campo alguns valores padrao pro meu formulario
    defaultValues: {
      // cada dia da semana vai representar um objeto dentro desse array de intervals
      intervals:  [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ]
    },
  })

  // permite manipular um campo do formulario que é um array
  const { fields } = useFieldArray({
    // nome do campor a ser iterado
    name: 'intervals',
    //vem de dentro do useForm
    control,
  })

  //vai observar em tempo real o array intervals
  const intervals = watch('intervals')
  

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput;
    
    await api.post('/users/time-intervals', { intervals })
  }

  const weekDays = getWeekDays();

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá!</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>  

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          {
            fields.map((field, index) => (
              <IntervalItem key={field.id} >
                <IntervalDay>
                  <Controller 
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox 
                          onCheckedChange={checked => {
                            field.onChange(checked === true)
                          }}
                          checked={field.value}
                        />
                      )
                    }}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput 
                    size="sm"
                    type="time"
                    step={60}
                    // se o array de intervalos, na posicao do index no map, na propriedade enabled for false, desabilita o campo
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput 
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            ))
          }          
        </IntervalsContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}