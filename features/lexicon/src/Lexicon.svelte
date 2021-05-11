<style>
@font-face {
    font-family: "Jost";
    src: url("../fonts/jost_regular.ttf");
}

:global(body) {
    background-color: #3749a9;
    padding: 0;
    margin: 0;
    border-top: 1px solid #f7fafc;
}

* {
    color: #f7fafc;
    box-sizing: border-box;
    font-family: Jost;
    font-weight: 500;
}

button {
    border: none;
    background: none;
}

.lexicon {
    width: 100%;
    max-width: 412px;
    margin: auto;
}

.search-bar-area {
    width: 100%;
    max-width: 412px;
    display: flex;
    justify-content: center;
    margin: auto;
    padding: 23px 24px 29px 24px;
    flex: 0 0 auto;
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
    font-weight: 400;
}

.search-bar-area .search-bar button {
    margin: 0;
    padding: 0;
}

.term-list-container {
    width: 100%;
    overflow-y: scroll;
}

.term-list-container .term-list {
    display: flex;
    flex-direction: row;
    justify-content: start;
    margin: 0 20px;
}

.term-list-container .term-list h1 {
    font-size: 16px;
    margin: 0;
}

.term-list-container .term-list h2 {
    margin: 0 0 17px 20px;
    font-size: 20px;
}

.term-list-container .result h2 {
    margin: 0 20px 17px 50px;
    font-size: 20px;
}

.term-description {
    padding: 40px 22px 32px 26px;
    font-size: 16px;
    line-height: 19.2px;
    font-weight: 400;
}

.term-description h2 {
    margin: 0 0 39px 0;
    font-size: 24px;
    line-height: 28.8px;
}

.term-description .scroll-container {
    display: flex;
    flex-flow: column;
    overflow: hidden scroll;
    width: 100%;
    max-width: 412px;
    margin-bottom: 51px;
}

.term-description .button-area {
    display: block;
    background-color: #3749a9;
    max-width: 412px;
    margin: 0 auto;
    padding: 0 29px 32px 31px;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
}

.term-description button {
    width: 100%;
    height: 51px;
    background-color: #0f1938;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 16px;
}
</style>

<script>
import i18n from "./i18n.js";
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
            <div class="scroll-container">
                <h2>{showTerm}</h2>
                {@html lexicon.description(showTerm)}
            </div>
            <div class="button-area">
                <button on:click="{() => handleBack()}"
                    >{i18n.t("common:back")}</button>
            </div>
        </div>
    {:else}
        <!-- <div class="search-screen"> -->
        <div class="search-bar-area">
            <div class="search-bar">
                <input
                    class="search-bar-input"
                    type="text"
                    value="{searchString}"
                    placeholder="{i18n.t('common:search')}"
                    on:input="{(e) => handleSearch(e.target.value)}" />
                <button on:click="{() => handleClear()}">
                    <img alt="Clear search" src="./images/clear-search.svg" />
                </button>
            </div>
        </div>
        <div class="term-list-container">
            {#if searchString}
                <div class="result">
                    {#each lexicon.search(searchString) as entry}
                        <h2 on:click="{() => handleClickTerm(entry)}">
                            {entry}
                        </h2>
                    {/each}
                </div>
            {:else}
                {#each lexicon.groups as group}
                    <div class="term-list">
                        <h1>{group}</h1>
                        <div>
                            {#each lexicon.groupEntries(group) as entry}
                                <h2 on:click="{() => handleClickTerm(entry)}">
                                    {entry}
                                </h2>
                            {/each}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <!-- </div> -->
    {/if}
</main>
