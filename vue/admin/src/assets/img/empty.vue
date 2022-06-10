<template>
    <svg :x="x" :y="y" :height="height" :width="width" viewBox="0 0 40 40">
        <rect width="40" height="40" fill="transparent"/>
    </svg>
</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "empty",
        mixins:[ Svg ]
    }
</script>
