<template>
    <BorderPane>
        <template v-slot:top>
            <Header :type="header_types.cabinet"/>
        </template>
        <template v-slot:left>
            <NavigationMenu
                    :buttons="_pages" @navigate="setActivePage"/>
        </template>
        <template v-slot:center>
            <div class="workspace">
                <keep-alive>
                    <component :is="showingPage"/>
                </keep-alive>
            </div>
        </template>
    </BorderPane>
</template>

<script>
    import {
        ref
    }                     from 'vue'
    import {
        getPages
    }                     from './pages/pages.js'
    import {
        BorderPane,
        NavigationMenu
    }                     from 'saffarid-ui-kit'
    import {useStore}     from 'vuex'
    import Header         from "@/components/commons/header/Header";
    import {header_types} from "@/components/commons/header/header_types";

    export default {
        name: "Studio",
        components: {
            BorderPane,
            NavigationMenu,
            Header
        },
        setup() {
            const store = useStore()
            const _pages = getPages(store.getters.user)
            const showingPage = ref(_pages.Main)

            store.dispatch('cabinetInit')

            document.body.classList.toggle('no-scroll')

            const setActivePage = (page) => showingPage.value = _pages[page].workspace

            return {
                header_types,
                _pages,
                showingPage,
                setActivePage,
            }
        }
    }
</script>