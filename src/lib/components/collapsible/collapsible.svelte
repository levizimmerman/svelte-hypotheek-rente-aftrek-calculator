<script>
    export let collapsed = false;
</script>
<div class="collapse" style="--max-height:{collapsed ? '0' : '500px'}">
    <div class="container">
        <slot></slot>
    </div>
</div>

<style>
    .collapse {
        max-height: var(--max-height);
        overflow: hidden;
        transition: all 0.5s ease;
        margin: 0 -2rem;
    }
    .container {
        background: var(--bg-sheet-level);
        transition: background-color 0.5s ease;
        border-top: 1px dashed var(--bg-sheet-level-border);
        border-bottom: 1px dashed var(--bg-sheet-level-border);
        padding: 1rem 2rem;
        box-sizing: border-box;
    }
</style>