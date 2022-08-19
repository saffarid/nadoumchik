<template>
    <svg :x="x" :y="y" :height="height" :width="width" viewBox="0 0 40 40">
        <g>
            <rect width="40" height="40" fill="#fff" opacity="0"/>
            <path
                    d="M11.667,16.333A6.667,6.667,0,1,0,5,9.667,6.667,6.667,0,0,0,11.667,16.333Z"
                    transform="translate(3.333 2)" fill="#fff"/>
            <path d="M19,17a5,5,0,1,0-5-5A5,5,0,0,0,19,17Z"
                  transform="translate(9.333 4.667)" fill="#fff"/>
            <path d="M33.667,24.66a1.667,1.667,0,0,0,1.667-1.667A8.333,8.333,0,0,0,21.9,16.41,11.667,11.667,0,0,0,2,24.66a1.667,1.667,0,0,0,1.667,1.667h20a1.667,1.667,0,0,0,1.667-1.667"
                  transform="translate(1.333 8.673)" fill="#fff"/>
        </g>
    </svg>

</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "users",
        mixins: [Svg]
    }
</script>

<style scoped>

</style>