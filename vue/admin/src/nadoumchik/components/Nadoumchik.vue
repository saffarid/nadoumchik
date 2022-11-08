<template>
    <div>
        <Header :type="header_types.main"/>

        <div class="content-viewport">
            <Content/>
        </div>
    </div>
</template>

<script>
    import Header         from "@/components/commons/header/Header";
    import {header_types} from "@/components/commons/header/header_types";
    import {
        provide,
        ref,
        inject,
        reactive
    }                     from "vue";
    import {
        BorderPane,
    }                     from 'saffarid-ui-kit'
    import {asyncRequest} from "@/js/web";
    import {list_types}   from '@/components/commons/publications_list/lists/list_types'
    import Content        from "@/nadoumchik/components/Content";

    export default {
        name: "Nadoumchik",
        components: {
            Content,
            BorderPane,
            Header,
        },
        setup() {
            const api = inject('$api')
            const isReady = reactive({
                ads: false
            })
            const system = reactive({})
            const workObject = inject('workObject')

            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.system.name, api.ESSENCE.system.actions.get))
                .then(data => {
                    workObject.objectCopy(data.datas.findings[0], system)
                    provide('system', system)
                    isReady.ads = true
                })
                .catch(err => console.log(err))

            return {
                header_types,
                system,
            }
        }
    }
</script>

<style lang="scss">


</style>