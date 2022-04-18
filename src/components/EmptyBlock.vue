<template>
    <svg x="0" y="0" :height="height" :width="width" viewBox="0 0 24 250">
        <rect x="0" y="0" width="250px" height="24px" fill="red"/>
    </svg>
</template>

<script>
    export default {
        name: "EmptyBlock",
        props: {
            height: {
                type: Number,
                required: false,
                default: 24
            },
            width: {
                type: Number,
                required: false,
                default: 250
            }
        },
    }
</script>

<style scoped>

</style>