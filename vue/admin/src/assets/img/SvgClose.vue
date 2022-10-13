<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 24 24">
        <g>
            <rect width="24" height="24" transform="translate(24 24) rotate(180)" opacity="0"/>
            <path :fill="fill" d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,1,0,1.42,1.42L12,13.41l4.29,4.3a1,1,0,1,0,1.42-1.42Z"/>
        </g>

    </svg>

</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "SvgClose",
        mixins: [Svg]
    }
</script>

<style scoped>

</style>