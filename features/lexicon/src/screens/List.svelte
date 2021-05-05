<script>
    export let data;

    //this should depend on language setting
    const groups = data.de;
</script>

<div class="list">
    {#each Object.keys(groups) as group}
        <h2 class="group">{group}
        </h2>
        {#each Object.keys(groups[group]) as entry}
        <div class="content">
            <h3>{entry}</h3>
            {@html groups[group][entry]}
        </div>
        {/each}
    {/each}
</div>
