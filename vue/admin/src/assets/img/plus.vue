<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 40 40">
        <g>
            <rect width="40" height="40" opacity="0"/>
            <path d="M32.125,17.125H20.875V5.875a1.875,1.875,0,0,0-3.75,0v11.25H5.875a1.875,1.875,0,0,0,0,3.75h11.25v11.25a1.875,1.875,0,0,0,3.75,0V20.875h11.25a1.875,1.875,0,0,0,0-3.75Z"
                  transform="translate(1 1)"/>
        </g>
    </svg>


</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "plus",
        mixins: [Svg]
    }
</script>

<style scoped>

</style>