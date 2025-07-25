export function formatarNumeroBR(numero: number | null) {
  if(numero === null) return ''
  const partes = numero.toFixed(2).split('.');
  const inteiro = partes[0];
  const decimal = partes[1];

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${inteiroFormatado},${decimal}`;
}

export function formatarNumeroBRNoDecimal(numero: number | null) {
  if(numero === null) return ''
  const partes = numero.toFixed(2).split('.');
  const inteiro = partes[0];
  const decimal = partes[1];

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${inteiroFormatado}`;
}

export function aplicarMascaraNumero(valor: string): string {
 // Remove tudo que não for número ou vírgula
  let clean = valor.replace(/[^\d,]/g, '');

  // Se não há vírgula mas o usuário digitou, adiciona
  if (clean.endsWith(',')) return clean;

  const partes = clean.split(',');
  let inteiro = partes[0];
  let decimal = partes[1] || '';

  // Limita decimal a no máximo 2 dígitos
  if (decimal.length > 2) decimal = decimal.slice(0, 2);

  // Adiciona separador de milhar
  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Se o usuário digitou a vírgula mas ainda não completou as casas decimais
  if (clean.includes(',') && decimal === '') return `${inteiro},`;

  return decimal ? `${inteiro},${decimal}` : inteiro;
}
