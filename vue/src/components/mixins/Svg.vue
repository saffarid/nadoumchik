
<script>
    export default {
        name: "Svg",
        props: {
            x: {
                type: Number,
                required: false,
                default: 0
            },
            y: {
                type: Number,
                required: false,
                default: 0
            },
            height: {
                type: Number,
                required: false,
                default: 216
            },
            width: {
                type: Number,
                required: false,
                default: 216
            },
            fill:{
                type: String,
                required: false,
                default: '#ffffff'
            }
        }
    }
</script>

<style scoped>

</style>