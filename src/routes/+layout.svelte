<!-- File: src/routes/+layout.svelte (CORRIGIDO) -->
<script lang="ts">
  import '../app.css'; // O caminho agora está correto.
</script>

<div class="min-h-screen bg-base-100 text-base-content font-sans">
  <!-- O SvelteKit renderizará todas as nossas páginas aqui -->
  <slot />
</div>