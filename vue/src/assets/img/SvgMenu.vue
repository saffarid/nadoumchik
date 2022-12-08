<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 24 24">
        <g>
            <rect width="24" height="24" transform="translate(24 24) rotate(180)" opacity="0"/>
            <rect width="18" height="2" rx="0.95" transform="translate(3 11)" />
            <rect width="18" height="2" rx="0.95" transform="translate(3 16)" />
            <rect width="18" height="2" rx="0.95" transform="translate(3 6)"  />
        </g>
    </svg>

</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "SvgMenu",
        mixins: [Svg]
    }
</script>
