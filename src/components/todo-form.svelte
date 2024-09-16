<script lang="ts">
	import { useGenerateText, useAddTodo } from '$lib/use-todos';

	const { generateText } = useGenerateText();

	let text = generateText();

	const { addTodo } = useAddTodo();

	function add() {
		addTodo(text);
		text = generateText();
	}
</script>

<form on:submit|preventDefault={add}>
	<input class="border p-2 rounded-lg" bind:value={text} />
	<button class="border p-2 rounded-lg bg-purple-600 text-white font-semibold" type="submit">
		Add Task
	</button>
</form>
