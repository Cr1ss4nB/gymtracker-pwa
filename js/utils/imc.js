export const calculateIMC = (weight, height) => {
  return (weight / ((height / 100) ** 2)).toFixed(2)
}

export const getIMCStatus = (imc) => {
  imc = parseFloat(imc)
  if (imc < 18.5) {
    return {
      status: 'Bajo de peso',
      color: '#FFD700',
      hex: '#FFD700',
      recommendation: 'Se recomienda aumentar ingesta calórica y realizar entrenamiento de fuerza para ganar masa muscular saludablemente.'
    }
  }
  if (imc >= 18.5 && imc < 25) {
    return {
      status: 'Normal',
      color: '#28a745',
      hex: '#28a745',
      recommendation: 'Mantén tu estilo de vida saludable. Continúa con ejercicio regular y una alimentación balanceada.'
    }
  }
  if (imc >= 25 && imc < 30) {
    return {
      status: 'Sobrepeso',
      color: '#FFA500',
      hex: '#FFA500',
      recommendation: 'Se recomienda aumentar la actividad física y revisar tu alimentación para alcanzar un peso saludable.'
    }
  }
  return {
    status: 'Obesidad',
    color: '#dc3545',
    hex: '#dc3545',
    recommendation: 'Consulta con un profesional de salud. Se recomienda crear un plan personalizado de ejercicio y nutrición.'
  }
}
