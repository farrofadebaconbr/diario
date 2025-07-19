<!-- File: src/routes/(auth)/register/+page.svelte -->
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { registerSchema } from '$lib/schemas/authSchema';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const { form, errors, enhance } = superForm(data.form, {
    validators: zodClient(registerSchema)
  });
</script>

<h1 class="card-title text-2xl mb-4">Criar Conta</h1>
<!-- <SuperDebug data={$form} /> -->

<form method="POST" use:enhance>
  <div class="form-control">
    <label for="username" class="label">Username</label>
    <input
      type="text"
      id="username"
      name="username"
      class="input input-bordered"
      bind:value={$form.username}
      aria-invalid={$errors.username ? 'true' : undefined}
    />
    {#if $errors.username}<span class="text-error text-sm mt-1">{$errors.username}</span>{/if}
  </div>

  <div class="form-control mt-4">
    <label for="email" class="label">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      class="input input-bordered"
      bind:value={$form.email}
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
      bind:value={$form.password}
      aria-invalid={$errors.password ? 'true' : undefined}
    />
    {#if $errors.password}<span class="text-error text-sm mt-1">{$errors.password}</span>{/if}
  </div>

  <div class="form-control mt-4">
    <label for="passwordConfirm" class="label">Confirmar Senha</label>
    <input
      type="password"
      id="passwordConfirm"
      name="passwordConfirm"
      class="input input-bordered"
      bind:value={$form.passwordConfirm}
      aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
    />
    {#if $errors.passwordConfirm}<span class="text-error text-sm mt-1">{$errors.passwordConfirm}</span>{/if}
  </div>

  <div class="card-actions mt-6">
    <button type="submit" class="btn btn-primary w-full">Registrar</button>
  </div>
</form>

<div class="text-center mt-4">
  <a href="/login" class="link">Já tem uma conta? Faça o login</a>
</div>