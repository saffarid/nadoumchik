<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 24 24">
        <g>
            <rect width="24" height="24" transform="translate(24) rotate(90)" fill="#fff" opacity="0"/>
            <path d="M13.83,19a1,1,0,0,1-.78-.37l-4.83-6a1,1,0,0,1,0-1.27l5-6a1,1,0,0,1,1.54,1.28L10.29,12l4.32,5.36A1,1,0,0,1,13.83,19Z"
                  :fill="fill"/>
        </g>
    </svg>
</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "SvgBack",
        mixins: [Svg]
    }
</script>

