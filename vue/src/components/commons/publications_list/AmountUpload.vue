<template>
    <ComboBox
            :options="uploadBy"
            v-model="amount"/>
</template>

<script>
    import {
        ComboBox
    } from 'saffarid-ui-kit'
    import {
        ref
    } from "vue";

    export default {
        name: "AmountUpload",
        components: {
            ComboBox
        },
        props: {
            amount: {
                type: Number,
                required: true,

            }
        },
        setup() {

            const uploadBy = {
                10: {
                    disabled: false,
                    value: 10,
                    selected: false,
                    label: 10
                },
                20: {
                    disabled: false,
                    value: 20,
                    selected: false,
                    label: 20
                },
                30: {
                    disabled: false,
                    value: 30,
                    selected: false,
                    label: 30
                },
                40: {
                    disabled: false,
                    value: 40,
                    selected: false,
                    label: 40
                }
            }

            return {
                uploadBy
            }
        }
    }
</script>

<style scoped>

</style>