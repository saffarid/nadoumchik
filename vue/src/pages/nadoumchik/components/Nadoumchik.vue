<template>
    <div>
        <Header :type="header_types.main"/>

        <div class="content-viewport">
            <Content/>
        </div>
    </div>
</template>

<script>
    import {
        inject,
        reactive,
        onActivated
    }                     from "vue";
    import {useStore}     from 'vuex'
    import Content        from "@/pages/nadoumchik/components/Content";
    import Header         from "@/components/commons/header/Header";
    import {header_types} from "@/components/commons/header/header_types";

    export default {
        name: "Nadoumchik",
        components: {
            Content,
            Header,
        },
        setup() {
            const store = useStore()
            const system = reactive({})
            const workObject = inject('workObject')

            onActivated(() => {
                workObject.objectCopy(store.getters.system, system)
            })

            const contentScroll = ($event) => {

                const scrollHeight = $event.target.scrollingElement.scrollHeight;
                const scrollTop = $event.target.scrollingElement.scrollTop;
                const clientHeight = $event.target.scrollingElement.clientHeight;

                if ((scrollHeight - (scrollTop + clientHeight)) < 300) {
                    if (!store.getters.noMorePublications) {
                        store.dispatch('loadPublication')
                    }
                }

            }

            window.addEventListener('scroll', contentScroll)

            return {
                contentScroll,
                header_types,
                system,
            }
        }
    }
</script>