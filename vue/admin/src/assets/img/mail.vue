<template>
    <svg :x="x" :y="y" :height="height" :width="width" viewBox="0 0 40 40">
        <g>
            <rect width="40" height="40" opacity="0"/>
            <path d="M30.333,4H7A5,5,0,0,0,2,9V25.667a5,5,0,0,0,5,5H30.333a5,5,0,0,0,5-5V9a5,5,0,0,0-5-5ZM29.217,7.333,18.667,15.25,8.117,7.333Zm1.117,20H7a1.667,1.667,0,0,1-1.667-1.667V9.417l12.333,9.25a1.667,1.667,0,0,0,2,0L32,9.417v16.25A1.667,1.667,0,0,1,30.333,27.333Z"
                  transform="translate(1.333 2.667)"/>
        </g>
    </svg>

</template>

<script>
    import Svg from "../../components/mixins/Svg";

    export default {
        name: "mail",
        mixins: [Svg]
    }
</script>

<style scoped>

</style>