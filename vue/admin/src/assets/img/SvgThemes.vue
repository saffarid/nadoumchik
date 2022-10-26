<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 24 24">
        <g>
            <rect width="24" height="24" transform="translate(24 24) rotate(180)" fill="#fff" opacity="0"/>
            <circle cx="1" cy="1" r="1" transform="translate(3 6)" fill="#fff"/>
            <circle cx="1" cy="1" r="1" transform="translate(3 11)" fill="#fff"/>
            <circle cx="1" cy="1" r="1" transform="translate(3 16)" fill="#fff"/>
            <rect width="14" height="2" rx="0.94" transform="translate(7 11)" fill="#fff"/>
            <rect width="14" height="2" rx="0.94" transform="translate(7 16)" fill="#fff"/>
            <rect width="14" height="2" rx="0.94" transform="translate(7 6)" fill="#fff"/>
        </g>
    </svg>
</template>

<script>
    import Svg from "@/components/mixins/Svg";

    export default {
        name: "SvgThemes",
        mixins: [Svg]
    }
</script>
