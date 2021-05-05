<script>
	export let lexicon;
</script>

<main>
    <div class="lexicon">
        <div class="list">
            {#each lexicon.groups as group}
                <h1>{group}</h1>
                {#each lexicon.groupEntries(group) as entry}
                    <h2>{entry}</h2>
                    {@html lexicon.description(entry)}
                {/each}
            {/each}
        </div>
    </div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
