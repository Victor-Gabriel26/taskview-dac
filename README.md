# TaskView — Painel de Consulta e Acompanhamento de Tarefas

Projeto acadêmico para a atividade prática de DAC — Análise e Aplicação de Frameworks/Libs Frontend.

## O que o sistema faz
- Consulta a API pública e gratuita `https://jsonplaceholder.typicode.com/todos`.
- Mostra indicadores de tarefas totais, concluídas e pendentes.
- Permite pesquisar pelo título ou número da tarefa.
- Permite filtrar por situação e navegar por páginas de 12 registros.
- Apresenta carregamento, erro de rede, botão de tentar novamente e mensagem de lista vazia.
- Funciona em telas de computador e celular.

**Atenção:** a API fornece dados fictícios de testes. O sistema somente consulta dados, não grava tarefas.

## Requisitos para executar
- Node.js 22.12+ (ou 20.19+), npm e navegador moderno.
- Internet para instalar dependências e consultar a API.

## Comece aqui — Windows/VS Code
1. Extraia a pasta `Aplicacao_TaskView` de dentro do arquivo ZIP.
2. Abra **Visual Studio Code** → **Arquivo** → **Abrir Pasta** → selecione `Aplicacao_TaskView`.
3. No VS Code, abra **Terminal** → **Novo Terminal**.
4. Execute:

```bash
npm install
npm run dev
```

5. Abra o endereço mostrado no terminal (normalmente `http://127.0.0.1:5173/`).
6. Para encerrar o servidor, use `Ctrl + C` no terminal.

> Se `npm` não for reconhecido, instale o Node.js e reinicie o VS Code. Se uma porta estiver ocupada, o Vite pode indicar outra.

## Organização
```text
Aplicacao_TaskView/
├── index.html                 # Página que carrega a aplicação
├── package.json               # Dependências e comandos
├── vite.config.js             # Configuração do Vite com Vue
└── src/
    ├── main.js                # Ponto de entrada
    ├── App.vue                # Tela, estado, filtros e lógica
    ├── style.css              # Layout, cores e responsividade
    ├── components/
    │   └── TarefaCard.vue     # Componente de uma tarefa
    └── services/
        └── todos.js           # Requisição assíncrona à API externa
```

## Por onde começar a entender o código
1. Abra `src/services/todos.js`: veja `fetch()`, `await`, verificação de `resposta.ok` e `resposta.json()`.
2. Abra `src/App.vue`: veja `ref()` para os dados, `onMounted()` para iniciar a consulta, `computed()` para os totais, busca, filtro e paginação, e `v-for` para montar a lista.
3. Abra `src/components/TarefaCard.vue`: cada tarefa recebida aparece aqui.
4. Abra `src/style.css`: a apresentação visual é controlada aqui.

## Teste em sala
- Ao abrir, espere surgir a lista.
- Digite `delectus` ou o número `1` na busca; o resultado muda.
- Clique em `Concluídas` e depois `Pendentes`.
- Clique em `Próxima` e `Anterior`.
- Clique em `Atualizar dados`.
- Com o navegador offline, clique em `Atualizar dados` e verifique a mensagem de erro; reative a conexão e tente novamente.
- Pressione `F12` → **Network / Rede** e procure a chamada `GET /todos` com resposta `200` (se houver conexão).

## Gerar versão de produção
```bash
npm run build
npm run preview
```

Os arquivos da versão de produção ficam em `dist/` após `npm run build`. Não é necessário instalar `dist/` para realizar a apresentação.

## Referências de estudo
- https://vuejs.org/guide/introduction.html
- https://vuejs.org/guide/extras/composition-api-faq.html
- https://vite.dev/guide/
- https://jsonplaceholder.typicode.com/
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
