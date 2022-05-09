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
                <Main v-if="pages.Main.vIf" v-show="pages.Main.active"/>
                <Publications v-if="pages.Publications.vIf" v-show="pages.Publications.active"/>
                <Categories v-if="pages.Categories.vIf" v-show="pages.Categories.active"/>
            </div>
        </template>
    </BorderPane>
</template>

<script>


    import {
        BorderPane,
        NavigationMenu
    } from 'saffarid-ui-kit'

    import Header from "@/components/commons/Header";
    import Main from "@/components/admin/pages/Main";
    import Publications from "@/components/admin/pages/publications/Publications";
    import Categories from "@/components/admin/pages/Categories";
    // import {reactive} from "@vue/reactivity";

    // function debug() {    }
    function debug(val) {
        console.debug(val)
    }

    export default {
        name: "Studio",
        data() {
            return {
                activePage: 'Main',
                pages: {
                    Main: {
                        title: 'Главная',
                        img: 'dashboard',
                        changed: false,
                        active: true,
                        vIf: true,
                    },
                    Publications: {
                        title: 'Публикации',
                        img: 'net',
                        changed: false,
                        active: false,
                        vIf: false,
                    },
                    Categories: {
                        title: 'Категории публикаций',
                        img: 'net',
                        changed: false,
                        active: false,
                        vIf: false,
                    }
                }
            }
        },
        components: {
            Categories,
            Publications,
            BorderPane,
            NavigationMenu,
            Main,
            Header
        },
        methods: {
            setActivePage(page) {
                debug(['setActivePage', page])
                if (this.activePage === page) return

                if (this.activePage != '') this.pages[this.activePage].active = false

                if (page !== '') {
                    this.pages[page].vIf |= true // если хоть раз открыли, то кешируем true, чтобы страница не грохнулась при переключении на другую
                    this.pages[page].active = true
                    debug('setActivePage ok')
                }
                this.activePage = page
            }
        },
        // setup() {
        //     const pages = reactive({
        //         Main: {
        //             title: 'Главная',
        //             img: 'dashboard',
        //             changed: false,
        //             active: false,
        //             vIf: false,
        //         },
        //         Publications: {
        //             title: 'Публикации',
        //             img: 'net',
        //             changed: false,
        //             active: false,
        //             vIf: false,
        //         }
        //     })
        //     let activePage = ''
        //     function setActivePage(page) {
        //         debug(['setActivePage', page])
        //         if (activePage === page) return
        //
        //         if (activePage != '') pages[activePage].active = false
        //
        //         if (page !== '') {
        //             pages[page].vIf |= true // если хоть раз открыли, то кешируем true, чтобы страница не грохнулась при переключении на другую
        //             pages[page].active = true
        //             debug('setActivePage ok')
        //         }
        //         activePage = page
        //     }
        //
        //     setActivePage('Main')
        //
        //     return {
        //         pages,
        //         setActivePage
        //     }
        // }

    }
</script>

<style lang="scss" scoped>
    @import "./src/assets/style/main";
</style>