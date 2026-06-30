// Amostra estática da tabela CMED/ANVISA (licença pública).
// Substituível por fetch/CSV real em etapa futura. Ver projeto_omni_perfis_demo.md.
//
// Campos baseados na estrutura da tabela CMED publicada pelo Ministério da Saúde.
// pfSemImposto = Preço de Fábrica sem impostos (teto para venda à farmácia).
// pmcSemImposto = Preço Máximo ao Consumidor sem impostos (teto para venda ao paciente).

export interface CmedRow {
  produto: string;
  apresentacao: string;
  principioAtivo: string;
  pfSemImposto: number;
  pmcSemImposto?: number;
}

export const CMED_FIXTURE: CmedRow[] = [
  {
    produto:        'Novalgina',
    apresentacao:   '500mg comprimido caixa com 20',
    principioAtivo: 'Dipirona Monoidratada',
    pfSemImposto:   8.42,
    pmcSemImposto:  11.70,
  },
  {
    produto:        'Tylenol',
    apresentacao:   '750mg comprimido caixa com 20',
    principioAtivo: 'Paracetamol',
    pfSemImposto:   14.18,
    pmcSemImposto:  19.70,
  },
  {
    produto:        'Amoxil',
    apresentacao:   '500mg cápsula caixa com 21',
    principioAtivo: 'Amoxicilina',
    pfSemImposto:   18.55,
    pmcSemImposto:  25.78,
  },
  {
    produto:        'Losart',
    apresentacao:   '50mg comprimido caixa com 30',
    principioAtivo: 'Losartana Potássica',
    pfSemImposto:   11.30,
    pmcSemImposto:  15.70,
  },
  {
    produto:        'Omep',
    apresentacao:   '20mg cápsula caixa com 28',
    principioAtivo: 'Omeprazol',
    pfSemImposto:   9.87,
    pmcSemImposto:  13.71,
  },
  {
    produto:        'Dorflex',
    apresentacao:   'comprimido caixa com 36',
    principioAtivo: 'Dipirona + Orfenadrina + Cafeína',
    pfSemImposto:   16.24,
    pmcSemImposto:  22.56,
  },
  {
    produto:        'Buscopan Composto',
    apresentacao:   '10mg + 250mg comprimido caixa com 20',
    principioAtivo: 'Butilbrometo de Escopolamina + Dipirona',
    pfSemImposto:   13.60,
    pmcSemImposto:  18.89,
  },
];
