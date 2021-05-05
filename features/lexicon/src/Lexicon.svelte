<script>
    import allTranslations from "./translations/translations.js";
	export let lexicon;
    let showTerm = null;
    let searchString = "";
    const translations = allTranslations[lexicon.language]

    function handleClickTerm(term) {
        showTerm = term
    }

    function handleBack() {
        showTerm = null;
    }

    function handleSearch(value) {
        searchString = value
    }

    function handleClear() {
        searchString = ""
    }
</script>

<main>
    <div class="lexicon">
        {#if showTerm}
        <div class="term-description">
            <h2>{showTerm}</h2>
            {@html lexicon.description(showTerm)}
            <button on:click={() => handleBack()}>{translations.back}</button>
        </div>
        {:else }
        <div class="list">
            <input type="text" value={searchString} placeholder={translations.search} on:input={(e) => handleSearch(e.target.value)}/>
            <button on:click={() => handleClear()}>X</button>
            {#if searchString}
                {#each lexicon.search(searchString) as entry}
                    <h2 on:click={() => handleClickTerm(entry)}>{entry}</h2>
                {/each}
            {:else}
            {#each lexicon.groups as group}
                <h1>{group}</h1>
                {#each lexicon.groupEntries(group) as entry}
                    <h2 on:click={() => handleClickTerm(entry)}>{entry}</h2>
                {/each}
            {/each}
            {/if}
        </div>
        {/if}
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
