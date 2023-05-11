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
        background: #f5f5f5;
        border-top: 1px dashed #bbb;
        border-bottom: 1px dashed #bbb;
        padding: 1rem 2rem;
        box-sizing: border-box;
    }
</style>