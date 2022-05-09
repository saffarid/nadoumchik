<template>
    <div class="response-bar" :class="colorStatus">
        <div>
            <TextLabel label="КОД ОТВЕТА:"/>
        </div>
        <div>
            <TextLabel :label="response.code"/>
        </div>
        <div>
            <TextLabel label="СООБЩЕНИЕ:"/>
        </div>
        <div>
            <TextLabel :label="response.message"/>
        </div>
    </div>
</template>

<script>
    import {
        computed,
        reactive,
        watch
    } from 'vue'
    import {
        TextLabel
    } from 'saffarid-ui-kit'
    export default {
        name: "ResponseBar",
        components:{
            TextLabel
        },
        props:{
            response:{
                type: Object,
                required:true
            }
        },
        setup(props){
            const localResponse = reactive(props.response)
            watch(localResponse, () => {
                setTimeout(() => {
                    localResponse.code = -1
                    localResponse.message = ''
                }, 5000)
            })
            const colorStatus = computed(() => {
                if(props.response.code === 200){
                    return {
                        'none': false,
                        'good': true,
                        'warning': false,
                        'alarm': false
                    }
                }else{
                    return {
                        'none': true,
                        'good': false,
                        'warning': false,
                        'alarm': false
                    }
                }
            })
            return {
                colorStatus
            }
        }
    }
</script>

<style scoped>

</style>