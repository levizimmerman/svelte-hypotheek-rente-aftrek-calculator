<script>
    export let tip = "hello";
    let wrapper;
    console.log('wrapper', wrapper);
</script>

<span class="wrapper">
    <slot></slot>
    <span class="tip">{tip}</span>
</span>

<style>
    .wrapper {
        position: relative;
    }
    .tip {
        position: absolute;
        top: 0;
        left: 50%;
        background: var(--bg-brand);
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
        letter-spacing: 0.1ch;
        color: var(--text-on-brand);
        padding: 0.25rem 0.5rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        opacity: 0;
        min-width: 15ch;
        pointer-events: none;
        transition: all 0.2s ease;
        transform: translate(-50%, -150%);
        pointer-events: none;
        text-align: center;
    }
    .wrapper:hover .tip {
        opacity: 1;
        transform: translate(-50%, -100%);
    }
</style>

