export function convertTimeStringToMinutes(timeString: string) {
  // divido onde tem dois pontos, o split retorna um array
  const [hours, minutes] = timeString.split(':').map(Number)

  return hours * 60 + minutes
}