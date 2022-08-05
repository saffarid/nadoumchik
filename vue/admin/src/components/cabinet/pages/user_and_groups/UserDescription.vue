<template>
    <Tabs :options="{ useUrlFragment: false }">

    </Tabs>
</template>

<script>
    import {
        Tabs,
        Tab
    } from 'vue3-tabs-component'

    export default {
        name: "UserDescription",
        components:{

        },
        props: {
            user: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>