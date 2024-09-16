<script lang="ts">
	import { useUser } from '$lib/use-user';

	const user = useUser();
</script>

{#if $user}
	<div class="flex flex-col justify-center items-center gap-3">
		<h3 class="text-2xl font-bold">Hi {$user.displayName}!</h3>

		{#if $user.photoURL}
			<img src={$user.photoURL} height="100" width="100" alt="user avatar" />
		{/if}
		<p>Your userID is {$user.uid}</p>
	</div>
{/if}
