<script>
	import '../app.css';
</script>

<slot />
<nav class="flex gap-3 justify-center mt-5">
	<a href="/">Home</a>
	<a data-sveltekit-preload-data="false" href="/about">About</a>
</nav>
