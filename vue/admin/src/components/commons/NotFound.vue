<template>
    <div>
        <CryingEmoji :height="250" :width="250"/>
        Нет публикаций для отображения
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

</style>