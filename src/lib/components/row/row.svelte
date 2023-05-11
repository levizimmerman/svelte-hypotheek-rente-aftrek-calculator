
<script>
    export let justifyContent = 'space-between';
    export let gap = 8;
</script>

<div class="row" style="--justify-content: {justifyContent};--gap: {gap}px;"><slot></slot></div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: var(--justify-content);
        align-items: center;
        gap: var(--gap);
        margin: 1rem 0;
        position: relative;
    }
</style>