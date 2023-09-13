import { HandPalm, Play } from 'phosphor-react'; // Importa o ícone de "Play" da biblioteca Phosphor Icons
import { FormProvider, useForm} from 'react-hook-form';  // Importa o hook useForm da biblioteca react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';  // Importa o resolvedor para validação de formulários com zod
import * as zod from 'zod';  // Importa a biblioteca zod para validação de esquemas de dados
import { HomeContainer, StartCountdownButton, StopCountdownButton, } from './styles';  // Importa componentes estilizados do arquivo 'styles'

import {useContext } from 'react';  // Importa os hooks useEffect e useState do React

import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import { CyclesContext } from '../../contexts/CyclesContext';



const newCycleFormValidationSchema = zod.object({  // Define um esquema de validação zod para o formulário
  task: zod.string().min(1, 'Informe a tarefa'),  // Validação para o campo 'task'
  minutesAmount: zod.number().min(5).max(60)  // Validação para o campo 'minutesAmount'
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;  // Define o tipo dos dados do formulário com base no esquema de validação

export function Home() {  // Componente principal chamado 'Home'
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)
  
  const newCycleForm = useForm<NewCycleFormData>({  // Inicializa o hook useForm para gerenciar o formulário
    resolver: zodResolver(newCycleFormValidationSchema),  // Usa o resolvedor zod para validação
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData ) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task');  // Obtém o valor do campo 'task' do formulário
  const isSubmitDisabled = !task;  // Verifica se o botão de envio deve estar desabilitado

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />  
        </FormProvider>
        <Countdown />
      

        {activeCycle ? ( //Se tiver um cinclo já iniciado
          <StopCountdownButton onClick = {interruptCurrentCycle} type="button">
            <HandPalm size={24} />
             Interromper
          </StopCountdownButton>

        ) : ( // se não tiver
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
