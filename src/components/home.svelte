<script lang="ts">
	import { useAuth } from '$lib/use-user';
	import Todos from '@components/todos.svelte';
	import Profile from '@components/profile.svelte';
	import { useUser } from '$lib/use-user';

	const user = useUser();

	const { loginWithGoogle, logout } = useAuth();
</script>

<section class="flex flex-col gap-3 p-5 items-center">
	{#if $user}
		<Profile />
		<button
			class="border bg-blue-600 text-white w-fit p-3 rounded-lg font-semibold"
			on:click={logout}>Logout</button
		>
		<hr />
		<Todos />
	{:else}
		<button class="bg-red-600 text-white font-semibold p-2" on:click={loginWithGoogle}>
			Signin with Google
		</button>
	{/if}
</section>
