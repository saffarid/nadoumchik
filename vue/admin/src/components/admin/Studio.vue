<template>
    <BorderPane>
        <template v-slot:top>
            <Header/>
        </template>
        <template v-slot:left>
            <NavigationMenu
                    :buttons="pages" @navigate="setActivePage"
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
    import {
        reactive,
        ref,
        defineAsyncComponent
    } from 'vue'

    import {
        BorderPane,
        NavigationMenu
    } from 'saffarid-ui-kit'

    import Header               from "@/components/commons/Header";

    export default {
        name: "Studio",
        components: {
            BorderPane,
            NavigationMenu,
            Header
        },
        setup() {
            const pages = reactive({
                Main: {
                    title: 'Главная',
                    img: defineAsyncComponent(() => import('@/assets/img/dashboard')),
                    workspace: defineAsyncComponent(() => import('@/components/admin/pages/Main.vue')),
                    changed: false,
                    active: true,
                    vIf: true,
                },
                Publications: {
                    title: 'Публикации',
                    img: defineAsyncComponent(() => import('@/assets/img/ArticleLogo')),
                    workspace: defineAsyncComponent(() => import('@/components/admin/pages/publications/Publications.vue')),
                    changed: false,
                    active: false,
                    vIf: false,
                },
                ThemesOfPublications: {
                    title: 'Темы публикаций',
                    img: defineAsyncComponent(() => import('@/assets/img/empty')),
                    workspace: defineAsyncComponent(() => import('@/components/admin/pages/themes/ThemesOfPublications.vue')),
                    changed: false,
                    active: false,
                    vIf: false,
                }
            })
            const showingPage = ref('')

            function setActivePage(page) {
                showingPage.value = pages[page].workspace
            }

            setActivePage('Main')
            return {
                pages,
                showingPage,
                setActivePage,
            }
        }

    }
</script>

<style lang="scss" scoped>
    @import "./src/assets/style/main";
</style>