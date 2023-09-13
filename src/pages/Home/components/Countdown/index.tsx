import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";




export function Countdown () {
  const {
    activeCycle, 
    activeCycleId, 
    markCurrentCycleAsFinished, 
    amountSecondsPassed, 
    setSecondsPassed
  } = useContext(CyclesContext) // utilizando conceitos de Context para o compartilhamento de informações entre vários componentes ao mesmo tempo. 



  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;  // Calcula o total de segundos com base na duração do ciclo ativo

  useEffect(() => {  // Efeito para atualizar a contagem de segundos decorridos
    let interval: number;

    if (activeCycle) {  // Se houver um ciclo ativo
     
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date (activeCycle.startDate)
        )

        if(secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else{
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);  // Limpa o intervalo quando o ciclo é desativado
    };
  }, [activeCycle, totalSeconds, activeCycleId, setSecondsPassed, markCurrentCycleAsFinished]);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;  // Calcula os segundos restantes no ciclo

  const minutesAmount = Math.floor(currentSeconds / 60);  // Calcula a quantidade de minutos restantes
  const secondsAmount = currentSeconds % 60;  // Calcula a quantidade de segundos restantes

  const minutes = String(minutesAmount).padStart(2, '0');  // Formata os minutos com zero à esquerda, se necessário
  const seconds = String(secondsAmount).padStart(2, '0');  // Formata os segundos com zero à esquerda, se necessário

  useEffect(() => {  // Efeito para atualizar o título da página
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;  // Define o título da página com o tempo restante do ciclo
    }
  }, [minutes, seconds, activeCycle]);



  return(
    <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
  )
}