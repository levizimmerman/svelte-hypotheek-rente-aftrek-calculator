<script lang="ts">
	export let value = 0;
	export let step = 1;
	export let min = 0;
	export let name = '';
	export let id = '';
	export let suffix = '';
	export let prefix = '';
	export let formattedValue = '';
	export let focused = false;
	export let onChange = (event: Event) => {};
</script>

<div class="wrapper">
	{#if prefix.length > 0}<span class="prefix">{prefix}</span>{/if}
    {#if !focused}
	<input type="text" class="input formatted" value={formattedValue} disabled />
    {/if}
    <input
		type="number"
		on:focus={() => (focused = true)}
		on:blur={() => (focused = false)}
		class="input number"
		{id}
		{name}
		{value}
		{step}
		{min}
		on:change={onChange}
	/>
	{#if suffix.length > 0}<span class="suffix">{suffix}</span>{/if}
</div>

<style>
	.wrapper {
		position: relative;
	}
    .formatted {
        position:absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
    .number {
        opacity: 0;
    }
    .number:focus {
        opacity: 1;
    }
	.prefix,
	.suffix {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.5rem;
	}
	.suffix {
		right: -1.2ch;
	}
	.prefix {
		left: -1.2ch;
	}
	.input {
		border: none;
		background-color: transparent;
		border-bottom: 2px solid rgba(255, 255, 255, 0.25);
		border-radius: 4px;
		font-size: 1.5rem;
		font-family: var(--font-family);
		color: white;
		padding: 0.25rem 0;
		transition: background-color 0.1s ease-in-out;
		outline: none;
		max-width: 13ch;
		text-align: right;
	}
	@media screen and (max-width: 36rem) {
		.input {
			font-size: 1rem;
		}
	}
	.input:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}
	.input:focus {
		background-color: rgba(255, 255, 255, 0.15);
	}
</style>
