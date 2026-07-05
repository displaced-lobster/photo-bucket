<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    let src = $derived(`${data.photosBaseUrl}/${data.folder}/${data.photo}`);
</script>

<div class="frame">
    <img {src} alt={data.photo} />
</div>

<style>
    .frame {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100vh - 4rem);
    }

    img {
        display: block;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        border-radius: 20px;
    }
</style>
