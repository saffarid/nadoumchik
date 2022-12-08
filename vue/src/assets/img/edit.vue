<template>
    <svg :x="x" :y="y" :height="height" :width="width" viewBox="0 0 40 40">
        <g id="edit">
            <rect width="40" height="40" opacity="0"/>
            <path d="M29.669,9.528,25.1,4.961a3.333,3.333,0,0,0-4.433-.117l-15,15a3.333,3.333,0,0,0-.95,2.017L4,28.811a1.662,1.662,0,0,0,1.667,1.817h.15l6.95-.633a3.333,3.333,0,0,0,2.017-.95l15-15a3.2,3.2,0,0,0-.117-4.517Zm-17.2,17.133-5,.467.45-5,9.417-9.3,4.5,4.5ZM24,15.095l-4.467-4.467,3.25-3.333,4.55,4.55Z"
                  transform="translate(2.664 2.705)"/>
        </g>
    </svg>
</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "edit",
        mixins: [Svg]
    }
</script>

<style scoped>

</style>