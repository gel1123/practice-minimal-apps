<script setup lang="ts">
import type { App } from "./server/api/[...]";
import { hc } from "hono/client";

const baseUrl = useRequestURL();
const client = hc<App>(baseUrl.origin);

const { data, status, error, refresh } = useAsyncData(() =>
  client.api.hello[":name"]
    .$get({ param: { name: "sig" } })
    .then((res) => res.json()),
);
watchEffect(() => {
  console.log(`
    data: ${data.value?.message},
    status: ${status.value},
    error: ${error.value?.message},
  `);
});
</script>

<template>
  <div>
    <button @click="() => refresh()">refresh</button>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
