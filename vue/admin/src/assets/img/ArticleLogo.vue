<template>

    <svg :x="x" :y="y" :height="height" :width="width" viewBox="0 0 40 40">
        <g>
            <rect width="40" height="40" opacity="0"/>
            <path d="M30.378,10.933,22.937,2.553A1.676,1.676,0,0,0,21.7,2H8.29A4.24,4.24,0,0,0,4,6.19V31.328a4.24,4.24,0,0,0,4.29,4.19H26.524a4.24,4.24,0,0,0,4.29-4.19V12.055a1.676,1.676,0,0,0-.436-1.123Zm-18,7.826h5.028a1.676,1.676,0,0,1,0,3.352H12.379a1.676,1.676,0,0,1,0-3.352ZM22.435,28.814H12.379a1.676,1.676,0,0,1,0-3.352H22.435a1.676,1.676,0,0,1,0,3.352Zm-.486-16.759a1.324,1.324,0,0,1-1.19-1.424V5.352l6.268,6.7Z"
                  transform="translate(2.704 1.352)"
                  fill="#fefefe"
            />
        </g>
    </svg>


</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "ArticleLogo",
        mixins: [
            Svg
        ]
    }
</script>

<style scoped>

</style>