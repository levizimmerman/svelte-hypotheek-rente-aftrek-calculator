<script lang="ts">
    export let showCalc = true;
</script>

<section class="wrapper">
        <div class="row top">
            <slot name="label"></slot>
        </div>
        <div class="row bottom">
            {#if showCalc}
            <slot name="calc"></slot>
            {/if}
            <div class="outcome">
                <slot name="outcome"></slot>
            </div>
        </div>
</section>

<style>
    .wrapper {
        padding: 0.5rem 0;
    }
    .row.bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
    .outcome {
        text-align: right;
    }
</style>