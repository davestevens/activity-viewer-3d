<script lang="ts">
  import { navigate } from "svelte-routing";
  import { AUTH_KEY } from "../consts";

  const handleAuth = (): void => {
    const popup = window.open("/popup.html", "_blank", "width=700,height=600");
    window.onmessage = (message: any): void => {
      if (message.data.type === "AUTH") {
        // TODO: check error
        console.log(message.data);
        // TODO: move to a store
        localStorage.setItem(AUTH_KEY, JSON.stringify(message.data.data));
        popup.close();
        navigate("/activities");
      }
    };
  };
</script>

<style>
</style>

<main><button on:click={handleAuth}>Login</button></main>
