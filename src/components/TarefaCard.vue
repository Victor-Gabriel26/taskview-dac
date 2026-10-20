<script setup>
defineProps({
  tarefa: { type: Object, required: true }
})
</script>

<template>
  <article class="task-card">
    <div class="task-card-top">
      <span class="task-id">#{{ tarefa.id.toString().padStart(3, '0') }}</span>
      <span :class="['status-pill', tarefa.completed ? 'done' : 'pending']">
        <span class="status-dot" aria-hidden="true"></span>
        {{ tarefa.completed ? 'Concluída' : 'Pendente' }}
      </span>
    </div>
    <h3>{{ tarefa.title }}</h3>
    <p>Responsável demonstrativo: usuário {{ tarefa.userId }}</p>
  </article>
</template>
