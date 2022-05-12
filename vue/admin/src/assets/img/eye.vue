<template>
    <svg :x="x" :y="y" :height="height" :width="width" viewBox="0 0 32 32">
        <path d="  M16,7C9.934,7,4.798,10.776,3,16c1.798,5.224,6.934,9,13,9s11.202-3.776,13-9C27.202,10.776,22.066,7,16,7z"
              fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
        <circle cx="16" cy="16" fill="none" r="5" stroke-linecap="round"
                stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    </svg>
</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "eye",
        mixins:[
            Svg
        ]
    }
</script>

<style scoped>

</style>