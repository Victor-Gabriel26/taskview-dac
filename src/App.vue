<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { listarTarefas } from './services/todos'
import TarefaCard from './components/TarefaCard.vue'

const tarefas = ref([])
const pesquisa = ref('')
const status = ref('todas')
const pagina = ref(1)
const carregando = ref(false)
const erro = ref('')
const porPagina = 12
// A preferência é identificada antes de montar o Vue (em index.html).
const modoEscuro = ref(document.documentElement.dataset.theme === 'dark')

function alternarTema() {
  modoEscuro.value = !modoEscuro.value
  const tema = modoEscuro.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = tema

  // Guarda a preferência para a próxima visita, sem interferir na API.
  try {
    localStorage.setItem('taskview-tema', tema)
  } catch (_) {
    // O botão continua funcionando mesmo com armazenamento bloqueado.
  }
}
let requisicaoAtual = null

const total = computed(() => tarefas.value.length)
const concluidas = computed(() => tarefas.value.filter((tarefa) => tarefa.completed).length)
const pendentes = computed(() => total.value - concluidas.value)

const tarefasFiltradas = computed(() => {
  const termo = pesquisa.value.toLocaleLowerCase('pt-BR').trim()
  return tarefas.value.filter((tarefa) => {
    const combinaTexto = tarefa.title.toLocaleLowerCase('pt-BR').includes(termo) ||
      String(tarefa.id).includes(termo)
    const combinaStatus = status.value === 'todas' ||
      (status.value === 'concluidas' && tarefa.completed) ||
      (status.value === 'pendentes' && !tarefa.completed)
    return combinaTexto && combinaStatus
  })
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(tarefasFiltradas.value.length / porPagina)))
const tarefasVisiveis = computed(() => tarefasFiltradas.value.slice((pagina.value - 1) * porPagina, pagina.value * porPagina))

watch([pesquisa, status], () => { pagina.value = 1 })

async function carregarTarefas() {
  if (requisicaoAtual) requisicaoAtual.abort()
  requisicaoAtual = new AbortController()
  carregando.value = true
  erro.value = ''

  try {
    tarefas.value = await listarTarefas({ signal: requisicaoAtual.signal })
    pagina.value = 1
  } catch (falha) {
    if (falha.name !== 'AbortError') {
      erro.value = `Não foi possível consultar as tarefas. ${falha.message}`
      tarefas.value = []
    }
  } finally {
    if (!requisicaoAtual.signal.aborted) carregando.value = false
  }
}

function limparFiltros() {
  pesquisa.value = ''
  status.value = 'todas'
  pagina.value = 1
}

onMounted(carregarTarefas)
onUnmounted(() => requisicaoAtual?.abort())
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="#inicio" aria-label="Ir para o início do TaskView">
        <span class="brand-mark" aria-hidden="true">T<span>✓</span></span>
        <span>Task<span class="brand-light">View</span></span>
      </a>
      <div class="topbar-actions">
        <span class="topbar-tag">Projeto acadêmico • Vue.js 3</span>
        <button
          type="button"
          class="theme-toggle"
          :aria-label="modoEscuro ? 'Ativar modo claro' : 'Ativar modo escuro'"
          :title="modoEscuro ? 'Ativar modo claro' : 'Ativar modo escuro'"
          @click="alternarTema"
        >
          <span class="theme-toggle-icon" aria-hidden="true">{{ modoEscuro ? '☀' : '☾' }}</span>
          <span class="theme-toggle-text">{{ modoEscuro ? 'Modo claro' : 'Modo escuro' }}</span>
        </button>
      </div>
    </header>

    <main id="inicio" class="container">
      <section class="hero" aria-labelledby="titulo-painel">
        <div class="hero-copy">
          <span class="eyebrow">DADOS CONSULTADOS DA API EXTERNA</span>
          <h1 id="titulo-painel">Um jeito simples de <span>acompanhar tarefas.</span></h1>
          <p>Consulte atividades, acompanhe situações e encontre o que precisa em poucos cliques.</p>
          <div class="hero-actions">
            <button class="button-primary" type="button" @click="carregarTarefas" :disabled="carregando">
              {{ carregando ? 'Atualizando...' : '↻ Atualizar dados' }}
            </button>
            <a href="https://jsonplaceholder.typicode.com/todos" target="_blank" rel="noopener noreferrer" class="api-link">Consultar API ↗</a>
          </div>
        </div>
        <div class="hero-decoration" aria-hidden="true">
          <div class="decor-card"><span class="decor-check">✓</span><div><span class="decor-line"></span><span class="decor-line smaller"></span></div></div>
          <div class="decor-card"><span class="decor-check pale">◷</span><div><span class="decor-line"></span><span class="decor-line smaller"></span></div></div>
          <div class="decor-card"><span class="decor-check">✓</span><div><span class="decor-line"></span><span class="decor-line smaller"></span></div></div>
        </div>
      </section>

      <section class="stats" aria-label="Indicadores das tarefas">
        <div class="stat-card"><span>Total de tarefas</span><strong>{{ total }}</strong><small>Registros recebidos da API</small></div>
        <div class="stat-card"><span>Concluídas</span><strong class="green">{{ concluidas }}</strong><small>Marcadas como concluídas</small></div>
        <div class="stat-card"><span>Pendentes</span><strong class="amber">{{ pendentes }}</strong><small>Aguardando conclusão</small></div>
      </section>

      <section class="list-section" aria-labelledby="titulo-lista">
        <div class="section-heading">
          <div><span class="eyebrow dark">CONSULTA DINÂMICA</span><h2 id="titulo-lista">Lista de tarefas</h2></div>
          <span class="result-count" aria-live="polite">{{ tarefasFiltradas.length }} resultado(s)</span>
        </div>

        <div class="filter-panel">
          <label class="search-box"><span class="sr-only">Pesquisar tarefas pelo título ou código</span><span aria-hidden="true">⌕</span>
            <input v-model="pesquisa" type="search" placeholder="Pesquisar por título ou número..." autocomplete="off" />
          </label>
          <div class="filter-buttons" aria-label="Filtrar tarefas por situação">
            <button v-for="opcao in [{ id: 'todas', texto: 'Todas' }, { id: 'concluidas', texto: 'Concluídas' }, { id: 'pendentes', texto: 'Pendentes' }]"
              :key="opcao.id" type="button" :class="['filter-button', { active: status === opcao.id }]"
              :aria-pressed="status === opcao.id" @click="status = opcao.id">{{ opcao.texto }}</button>
          </div>
        </div>

        <div v-if="carregando" class="notice" role="status">Buscando informações na API pública. Aguarde...</div>
        <div v-else-if="erro" class="notice error" role="alert"><strong>Falha na consulta.</strong><p>{{ erro }}</p><button type="button" class="button-primary" @click="carregarTarefas">Tentar novamente</button></div>
        <div v-else-if="tarefasFiltradas.length === 0" class="notice"><strong>Nenhuma tarefa encontrada.</strong><p>Altere os filtros ou faça uma nova pesquisa.</p><button type="button" class="button-secondary" @click="limparFiltros">Limpar filtros</button></div>
        <div v-else class="tasks-grid">
          <TarefaCard v-for="tarefa in tarefasVisiveis" :key="tarefa.id" :tarefa="tarefa" />
        </div>

        <nav v-if="!carregando && !erro && tarefasFiltradas.length > porPagina" class="pagination" aria-label="Paginação das tarefas">
          <button type="button" :disabled="pagina === 1" @click="pagina--">← Anterior</button>
          <span>Página {{ pagina }} de {{ totalPaginas }}</span>
          <button type="button" :disabled="pagina === totalPaginas" @click="pagina++">Próxima →</button>
        </nav>
      </section>
    </main>

    <footer class="footer">TaskView • Projeto didático de Frontend • API: JSONPlaceholder (dados fictícios)</footer>
  </div>
</template>
