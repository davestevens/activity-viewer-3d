<script lang="ts">
  const handleAuth = (): void => {
    const popup = window.open("/popup.html", "_blank", "width=700,height=600");
    window.onmessage = (message: any): void => {
      if (message.data.type === "AUTH") {
        console.log(message.data);
        popup.close();
      }
    };
  };
</script>

<style>
</style>

<main><button on:click={handleAuth}>Login</button></main>
