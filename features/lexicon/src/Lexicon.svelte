<style>
@font-face {
    font-family: "Jost Medium";
    src: url("../fonts/jost_medium.ttf");
}

:global(body) {
    background-color: #FFF5F5;
    padding: 0;
    margin: 0;
    overflow: hidden;
}

* {
    color: #0F1938;
    box-sizing: border-box;
    font-family: "Jost Medium";
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
    background-color: #FFF5F5;
    max-width: 412px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    flex: 0 0 auto;
    top: 0;
}

.search-bar-area .search-bar {
    width: 95%;
    height: 40px;
    background-color: #FFF5F5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    border: 1px solid #0F1938;
    border-radius: 20px;
    padding: 1px 12px;
    position: relative;
}

.search-bar-area .search-bar .search-bar-input {
    width: 100%;
    height: 40px;
    display: block;
    background-color: transparent;
    font-size: 18px;
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
}

.search-bar-area .search-bar .search-bar-input::placeholder {
    color: #6A798E;
    font-weight: 400;
}

.search-bar-area .search-bar button {
    margin: 2px 0 0 0;
    padding: 0;
}

.term-list-container {
    width: 100%;
    overflow-y: scroll;
    height: 100vh;
    padding: 16px 0px;
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

.term-list-container .no-result p {
    margin: 0 20px 17px 50px;
    color: #6A798E;
    font-size: 20px;
}

.term-list-container .result h2 {
    margin: 0 20px 17px 50px;
    font-size: 20px;
}

.term-description {
    padding: 40px 28px 32px 28px;
    font-size: 16px;
    line-height: 19.2px;
    font-weight: 400;
}

.term-description .top{
    display: flex;
    justify-content: space-between;
    margin: 0 0 39px 0;
}

.term-description .top h2 {
    font-size: 24px;
    line-height: 28.8px;
    margin: 0;
}

.term-description .top button {
    /* "Copy to clipboard" button is hidden until we add a notification to confirm that the text has been copied */
    display: none;
}

.term-description .scroll-container {
    display: flex;
    flex-flow: column;
    overflow: hidden scroll;
    width: 100%;
    height: 80vh;
    max-width: 412px;
    margin-bottom: 60px;
    position: relative;
    padding-bottom: 48px;
}

.term-description .scroll-container .gradient-area {
    position: absolute;
}

.term-description .scroll-container .gradient-area .gradient {
    position: fixed;
    bottom: 96px;
    right: 0;
    left: 0;
    height: 65px;
    pointer-events: none;
    background: linear-gradient(#FFF5F500 0%, #FFF5F5);
}

.term-description .scroll-container::after {
    content: "";
    display: block;
    height: 30px;
}

.term-description .button-area {
    display: block;
    background-color: #FFF5F5;
    max-width: 412px;
    margin: 0 auto;
    padding: 20px 28px 32px 28px;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
}

.term-description .back {
    width: 100%;
    height: 51px;
    background-color: #0f1938;
    color: #f7fafc;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 16px;
}

.clr {
    opacity: 0;
}

@keyframes fadeInClrBtn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.clr.active {
    opacity: 1;
    animation-name: fadeInClrBtn;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
}
</style>

<script>
import i18n from "./i18n.js";

export let lexicon;
let showTerm = null;
let searchString = "";
let pod = window.pod;
let scrollingProgress;
let savedScrollingProgress;
setUpListNavigation();

const onListLoad = (e) => {
    if (savedScrollingProgress) e.scrollTop = savedScrollingProgress
}

function handleClickTerm(term) {
    showTerm = term;
    savedScrollingProgress = scrollingProgress;
    setUpTermNavigation();
}

function handleCopytoClipboard(term) {
    let termDescription = term + ": " + lexicon.description(term);
    var div = document.createElement("div");
    div.innerHTML = termDescription;
    const termText = div.innerText || "";
    copyText(termText);
}

function copyText(text) {
    // There is no polyPod API for interacting with the system clipboard yet,
    // the following APIs were just temporarily exposed until that's the case.
    // If you want to follow the process, see:
    // https://jira.polypoly.eu/browse/PROD4POD-479 (internal at the moment)
    if (window.podInternal)
        window.podInternal.copyToClipboard(text);
    else
        navigator.clipboard.writeText(text)
}

function handleBack() {
    showTerm = null;
    setUpListNavigation();
}

function handleSearch(value) {
    searchString = value;
}

function handleClear() {
    searchString = "";
}

function setUpTermNavigation() {
        pod.polyNav.setTitle(i18n.t("title:details"));
        pod.polyNav.actions = {
                  back: () => handleBack(),
              };
        pod.polyNav.setActiveActions(
            ["back"]
        );
    }

function setUpListNavigation() {
    pod.polyNav.setTitle(i18n.t("title:lexicon"));
    pod.polyNav.setActiveActions([""]);
}
</script>

<main class="lexicon">
    <div class="poly-nav-bar-separator-fixed"></div>
    {#if showTerm}
        <div class="term-description">
            <div class="scroll-container">
                <div class="top">
                    <h2>{showTerm}</h2>
                    <button on:click="{handleCopytoClipboard(showTerm)}">
                        <img src="./images/Copy.svg" alt="{i18n.t("common:copy")}" title="{i18n.t("common:copy")}">
                    </button>
                </div>
                {@html lexicon.description(showTerm)}
                <div class="gradient-area">
                    <div class="gradient"></div>
                </div>
            </div>
            <div class="button-area">
                <button class="back" on:click="{() => handleBack()}"
                    >{i18n.t("common:back")}</button>
            </div>
        </div>
    {:else}
        <div class="search-bar-area">
            <div class="search-bar">
                <input
                    class="search-bar-input"
                    type="text"
                    value="{searchString}"
                    placeholder="{i18n.t('common:search')}"
                    on:input="{(e) => handleSearch(e.target.value)}" />
                <button class="clr {searchString ? "active": ""}" name="bar" on:click="{() => handleClear()}">
                    <img
                        alt="{i18n.t('common:clear')}"
                        src="./images/clear-search.svg" />
                </button>
            </div>
        </div>
        <div use:onListLoad on:scroll={(e) => scrollingProgress = e.target.scrollTop} class="term-list-container">
            {#if searchString}
                {#if lexicon.search(searchString).length === 0}
                    <div class="no-result">
                        <p>{i18n.t("common:noMatch")}</p>
                    </div>
                {:else}
                    <div class="result">
                        {#each lexicon.search(searchString) as entry}
                            <h2 on:click="{() => handleClickTerm(entry)}">
                                {entry}
                            </h2>
                        {/each}
                    </div>
                {/if}
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
    {/if}
</main>
