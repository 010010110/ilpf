export function formatarNumeroBR(numero: number | null) {
  if(numero === null) return ''
  const partes = numero.toFixed(2).split('.');
  const inteiro = partes[0];
  const decimal = partes[1];

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${inteiroFormatado},${decimal}`;
}