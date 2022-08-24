<template>
    <div class="not-found">
        <CryingEmoji :height="250" :width="250"/>
        <p>Нет публикаций для отображения</p>
    </div>
</template>

<script>

    import CryingEmoji from "@/assets/img/CryingEmoji";

    export default {
        name: "NotFound",
        components:{
            CryingEmoji
        }
    }
</script>

<style scoped>
    .not-found {
        display: grid;
        justify-items: center;
        justify-content: center;
    }
</style>