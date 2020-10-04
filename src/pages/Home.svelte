<script lang="ts">
  import { auth } from "../stores/auth";

  const handleAuth = (): void => {
    const popup = window.open("/popup.html", "_blank", "width=700,height=600");
    window.onmessage = (message: any): void => {
      if (message.data.type === "AUTH") {
        auth.setAuth(message.data.data);
        popup.close();
      }
    };
  };
</script>

<style>
</style>

<main><button on:click={handleAuth}>Login</button></main>
