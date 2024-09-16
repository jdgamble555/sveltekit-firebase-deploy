<script lang="ts">
	import { useDeleteTodo, useUpdateTodo } from '$lib/use-todos';

	export let todo: Todo;

	const { deleteTodo } = useDeleteTodo();
	const { updateTodo } = useUpdateTodo();

	function remove() {
		deleteTodo(todo.id);
	}

	function toggleStatus() {
		updateTodo(todo.id, !todo.complete);
	}
</script>

<span class={todo.complete ? 'text-green-600 line-through' : ''}>
	{todo.text}
</span>
<span class={todo.complete ? 'text-green-600 line-through' : ''}>
	{todo.id}
</span>

{#if todo.complete}
	<button on:click={toggleStatus}> ✔️ </button>
{:else}
	<button on:click={toggleStatus}> ❌ </button>
{/if}

<button on:click={remove}> 🗑 </button>
