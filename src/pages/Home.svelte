<script lang="ts">
  import { auth } from "../stores/auth";

  let error: string = "";

  const handleAuth = (): void => {
    const popup = window.open("/popup.html", "_blank", "width=700,height=600");
    window.onmessage = (message: any): void => {
      if (message.data.type === "AUTH") {
        if (message.data.error) {
          error = message.data.data;
        } else {
          auth.setAuth(message.data.data);
        }
        popup.close();
      }
    };
  };
</script>

<style>
</style>

<div class="row row h-100 justify-content-center align-items-center">
  <main class="col-4 text-center">
    <h1 class="display-3">Activity Viewer 3D</h1>
    <p class="lead">
      View your Strava activities in 3D space with heartrate data visualization.
    </p>
    <button
      type="button"
      class="btn btn-primary btn-lg btn-block mb-2"
      on:click={handleAuth}>Login</button>
    {#if error}
      <div class="alert alert-danger" role="alert">
        Something went wrong -
        {error}
      </div>
    {/if}
  </main>
</div>
