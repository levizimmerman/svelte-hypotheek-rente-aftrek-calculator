<script>
  export let forInput = "";
</script>

<label class="label" for={forInput}><slot>Label</slot></label>

<style>
    .label {
       font-size: 1.4rem;
    }
</style>