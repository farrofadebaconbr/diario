<!-- File: src/routes/(auth)/login/+page.svelte -->
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { loginSchema } from '$lib/schemas/authSchema';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;
  export let form; // Vem da action em caso de falha

  const { form: formData, errors, enhance } = superForm(form ?? data.form, {
    validators: zodClient(loginSchema)
  });
</script>

<h1 class="card-title text-2xl mb-4">Login</h1>
<!-- <SuperDebug data={$formData} /> -->

{#if form?.message}
  <div class="alert alert-error mb-4">
    <span>{form.message}</span>
  </div>
{/if}

<form method="POST" use:enhance>
  <div class="form-control">
    <label for="email" class="label">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      class="input input-bordered"
      bind:value={$formData.email}
      aria-invalid={$errors.email ? 'true' : undefined}
    />
    {#if $errors.email}<span class="text-error text-sm mt-1">{$errors.email}</span>{/if}
  </div>

  <div class="form-control mt-4">
    <label for="password" class="label">Senha</label>
    <input
      type="password"
      id="password"
      name="password"
      class="input input-bordered"
      bind:value={$formData.password}
      aria-invalid={$errors.password ? 'true' : undefined}
    />
    {#if $errors.password}<span class="text-error text-sm mt-1">{$errors.password}</span>{/if}
  </div>

  <div class="card-actions mt-6">
    <button type="submit" class="btn btn-primary w-full">Entrar</button>
  </div>
</form>

<div class="text-center mt-4">
  <a href="/register" class="link">Não tem uma conta? Crie uma agora</a>
</div>