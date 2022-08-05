<template>
    <BorderPane>
        <template v-slot:top>
            <Header/>
        </template>
        <template v-slot:left>
            <NavigationMenu
                    :buttons="_pages" @navigate="setActivePage"
            />
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
    import {ref}   from 'vue'
    import {pages} from './pages/pages.js'
    import {
        BorderPane,
        NavigationMenu
    }              from 'saffarid-ui-kit'
    import Header  from "@/components/commons/Header";

    export default {
        name: "Studio",
        components: {
            BorderPane,
            NavigationMenu,
            Header
        },
        setup() {
            const _pages = pages
            const showingPage = ref(_pages.Main)

            const setActivePage = (page) => {
                showingPage.value = _pages[page].workspace
            }

            return {
                _pages,
                showingPage,
                setActivePage,
            }
        }

    }
</script>

<style lang="scss" scoped>
    @import "./src/assets/style/main";
</style>