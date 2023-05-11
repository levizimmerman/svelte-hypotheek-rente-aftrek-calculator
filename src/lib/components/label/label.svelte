<script>
  export let forInput = "";
</script>

<label class="label" for={forInput}><slot>Label</slot></label>

<style>
    .label {
       font-size: 1.4rem;
    }
    @media screen and (max-width: 36rem) {
        .label {
            font-size: 1rem;
        }
    }
</style>