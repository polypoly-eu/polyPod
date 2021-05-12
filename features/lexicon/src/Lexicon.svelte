<style>
@font-face {
    font-family: "Jost";
    src: url("../fonts/jost_regular.ttf");
}

:global(body) {
    background-color: #3749a9;
    padding: 0;
}

* {
    color: white;
    box-sizing: border-box;
    font-family: Jost;
    font-weight: 500;
}

button {
    border: none;
    background: none;
}

main {
    text-align: center;
    /* padding: 0;
    margin: 0; */
}
@media (min-width: 640px) {
    main {
        max-width: none;
    }
}
.lexicon {
    width: 100%;
}

.search-bar-area {
    width: 100%;
    max-width: 412px;
    display: flex;
    justify-content: center;
    margin: auto;
    padding: 23px 24px 29px 24px;
}

.search-bar-area .search-bar {
    width: 100%;
    height: 40px;
    background-color: #3749a9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    border: 1px solid #f7fafc;
    border-radius: 20px;
    padding: 1px 12px 0 21px;
}

.search-bar-area .search-bar .search-bar-input {
    display: block;
    background-color: transparent;
    font-size: 18px;
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
}

.search-bar-area .search-bar .search-bar-input::placeholder {
    color: #f7fafc;
}

.search-bar-area .search-bar button {
    margin: 0;
    padding: 0;
}
</style>

<script>
import i18n from "./i18n.js"
export let lexicon;
let showTerm = null;
let searchString = "";

function handleClickTerm(term) {
    showTerm = term;
}

function handleBack() {
    showTerm = null;
}

function handleSearch(value) {
    searchString = value;
}

function handleClear() {
    searchString = "";
}
</script>

<main class="lexicon">
    {#if showTerm}
        <div class="term-description">
            <h2>{showTerm}</h2>
            {@html lexicon.description(showTerm)}
            <button on:click="{() => handleBack()}">{i18n.t("common:back")}</button>
        </div>
    {:else}
        <div class="search-bar-area">
            <div class="search-bar">
                <input
                    class="search-bar-input"
                    type="text"
                    value="{searchString}"
                    placeholder="{i18n.t("common:search")}"
                    on:input="{(e) => handleSearch(e.target.value)}" />
                <button on:click="{() => handleClear()}">
                    <img alt="Clear search" src="./images/clear-search.svg" />
                </button>
            </div>
        </div>
        <div class="list">
            {#if searchString}
                {#each lexicon.search(searchString) as entry}
                    <h2 on:click="{() => handleClickTerm(entry)}">
                        {entry}
                    </h2>
                {/each}
            {:else}
                {#each lexicon.groups as group}
                    <h1>{group}</h1>
                    {#each lexicon.groupEntries(group) as entry}
                        <h2 on:click="{() => handleClickTerm(entry)}">
                            {entry}
                        </h2>
                    {/each}
                {/each}
            {/if}
        </div>
    {/if}
</main>
