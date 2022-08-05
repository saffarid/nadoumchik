<template>
    <svg :x="x" :y="y" :height="height" :width="width" viewBox="0 0 24 24">
        <path fill="#fefefe"
              d="M12 11a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm6 10a1 1 0 0 0 1-1a7 7 0 0 0-14 0a1 1 0 0 0 1 1Z"/>
    </svg>
</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "user",
        mixins: [
            Svg
        ]
    }
</script>

<style scoped>

</style>