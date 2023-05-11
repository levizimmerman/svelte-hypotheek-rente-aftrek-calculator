<script>
    export let value = 0;
    export let step = 1;
    export let min = 0;
    export let name = "";
    export let id = "";
    export let onChange = () => {};
</script>


<input type="number" class="input" id={id} name={name} value="{value}" step={step} min={min} on:change={onChange} />

<style>
    .input {
        border: none;
        background-color: transparent;
        border-bottom: 2px solid rgba(255,255,255,0.25);
        font-size: 1.5rem;
        font-family: var(--font-family);
        color: white;
        padding: 0.25rem 0;
        transition: all 0.1s ease-in-out;
        outline: none;
        max-width: 10ch;
        text-align: right;
    }
    .input:hover {
        background-color: rgba(255,255,255,0.05);
    }
    .input:focus {
        background-color: rgba(255,255,255,0.15);
    }
</style>