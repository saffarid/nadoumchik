<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 40 40">
        <g>
            <rect width="40" height="40" opacity="0"/>
            <path d="M18.354,16l7.167-7.15a1.673,1.673,0,1,0-2.367-2.367L16,13.653,8.854,6.486A1.673,1.673,0,0,0,6.487,8.853L13.654,16l-7.167,7.15a1.673,1.673,0,1,0,2.367,2.367L16,18.353l7.15,7.167a1.673,1.673,0,1,0,2.367-2.367Z"
                  transform="translate(3.996 3.997)"/>
        </g>
    </svg>


</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "cancel",
        mixins: [
            Svg
        ]
    }
</script>

<style scoped>

</style>