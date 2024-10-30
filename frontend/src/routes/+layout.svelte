<script>
	import '../app.css';

	import { onMount } from 'svelte';

	onMount(() => {
		document.body.classList.add('bg-primary-300');
	});
</script>

<svelte:head>
	<title>📺 Youtube Pre Account</title>
	<meta
		name="description"
		content="Purchase Youtube Premium Account with 1 or 12 months warranty."
	/>
</svelte:head>

<div class="min-h-screen w-full bg-primary-300/90">
	<main>
		<slot />
	</main>
</div>
