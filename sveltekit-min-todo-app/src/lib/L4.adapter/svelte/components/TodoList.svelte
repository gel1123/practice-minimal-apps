<script lang="ts">
  import { trpcClient } from '$lib/L4.adapter/svelte/trpcClient';

  const pingPromise = trpcClient.ping.query({number: 3});
</script>

{#await pingPromise}
  <p>waiting for the promise to resolve...</p>
{:then pingValue}
  <p>The value is {pingValue}</p>
{:catch pingError}
  <p>Something went wrong: {pingError.message}</p>
{/await}
