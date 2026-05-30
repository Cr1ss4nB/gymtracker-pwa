export const calculateIMC = (weight, height) => {
  return (weight / ((height / 100) ** 2)).toFixed(2)
}

export const getIMCStatus = (imc) => {
  imc = parseFloat(imc)
  if (imc < 18.5) {
    return { status: 'Bajo de peso', color: '#FFD700', hex: '#FFD700' } // Amarillo
  }
  if (imc >= 18.5 && imc < 25) {
    return { status: 'Normal', color: '#28a745', hex: '#28a745' } // Verde
  }
  if (imc >= 25 && imc < 30) {
    return { status: 'Sobrepeso', color: '#FFA500', hex: '#FFA500' } // Naranja
  }
  return { status: 'Obesidad', color: '#dc3545', hex: '#dc3545' } // Rojo
}
