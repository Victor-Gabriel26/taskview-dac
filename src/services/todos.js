/**
 * Camada de acesso à API externa.
 * Dados originais: https://jsonplaceholder.typicode.com/todos
 *
 * Os títulos originais da API são textos fictícios, semelhantes a latim.
 * Para melhorar a compreensão, a interface exibe descrições DEMONSTRATIVAS
 * em português. Não se trata de tradução da resposta da API.
 *
 * Identificação (id), responsável (userId) e situação (completed)
 * continuam sendo lidos diretamente da API em cada consulta.
 */
const API_URL = 'https://jsonplaceholder.typicode.com/todos'

const titulosDemonstrativos = [
  'Verificar o funcionamento dos computadores',
  'Atualizar os sistemas dos colaboradores',
  'Realizar manutenção preventiva dos equipamentos',
  'Conferir os backups realizados',
  'Verificar a conexão com a internet',
  'Organizar os chamados de suporte técnico',
  'Instalar atualizações de segurança',
  'Configurar o acesso dos usuários',
  'Conferir os equipamentos de rede',
  'Atualizar o inventário de tecnologia',
  'Testar as impressoras do setor',
  'Revisar permissões das pastas compartilhadas',
  'Verificar o funcionamento do Wi-Fi',
  'Instalar os programas necessários',
  'Conferir o antivírus dos computadores',
  'Documentar os procedimentos de suporte',
  'Verificar a disponibilidade dos servidores',
  'Organizar os cabos e conexões de rede',
  'Validar o acesso ao sistema interno',
  'Realizar testes de restauração de arquivos'
]

// Contextos fictícios para diferenciar as 200 tarefas retornadas pela API.
const contextosDemonstrativos = [
  '',
  'Setor administrativo',
  'Setor financeiro',
  'Recursos humanos',
  'Setor comercial',
  'Equipe de engenharia',
  'Almoxarifado',
  'Equipe de operações',
  'Atendimento interno',
  'Infraestrutura de TI'
]

function obterTituloPortugues(id) {
  const indice = Math.max(0, id - 1)
  const tituloBase = titulosDemonstrativos[indice % titulosDemonstrativos.length]
  const grupo = Math.floor(indice / titulosDemonstrativos.length)
  const contexto = contextosDemonstrativos[grupo % contextosDemonstrativos.length]
  return contexto ? `${tituloBase} — ${contexto}` : tituloBase
}

export async function listarTarefas({ signal } = {}) {
  const resposta = await fetch(API_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  })

  if (!resposta.ok) {
    throw new Error(`O serviço respondeu com HTTP ${resposta.status}.`)
  }

  const dados = await resposta.json()
  if (!Array.isArray(dados)) {
    throw new Error('O formato de dados recebido não é uma lista de tarefas.')
  }

  return dados
    .filter((item) =>
      Number.isInteger(item.id) &&
      typeof item.title === 'string' &&
      typeof item.completed === 'boolean'
    )
    .map((item) => ({
      id: item.id,
      userId: Number(item.userId) || 0,
      title: obterTituloPortugues(item.id),
      tituloOriginal: item.title.trim(),
      completed: item.completed
    }))
}
