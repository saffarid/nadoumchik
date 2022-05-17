<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 40 40">
        <g>
            <rect width="40" height="40" opacity="0"/>
            <path d="M13.767,26.029a1.667,1.667,0,0,1-1.217-.533l-8.1-8.617A1.668,1.668,0,1,1,6.884,14.6l6.867,7.317L27.767,6.579a1.667,1.667,0,1,1,2.467,2.233L15,25.479a1.667,1.667,0,0,1-1.217.55Z"
                  transform="translate(2.666 3.971)"/>
        </g>
    </svg>


</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "checkmark",
        mixins: [
            Svg
        ]
    }
</script>

<style scoped>

</style>