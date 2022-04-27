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
                <NewPublication v-if="pages.NewPublication.vIf" v-show="pages.NewPublication.active"/>
            </div>
        </template>
    </BorderPane>
</template>

<script>


    import {
        BorderPane,
        NavigationMenu
    } from 'saffarid-ui-kit'

    import Header from "@/components/Header";
    import Main from "@/components/pages/Main";
    import Publications from "@/components/pages/publications/Publications";
    import NewPublication from "@/components/pages/publications/NewPublication";
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
                    NewPublication: {
                        title: 'Новая публикация',
                        img: 'net',
                        changed: false,
                        active: false,
                        vIf: false,
                    }
                }
            }
        },
        components: {
            Publications,
            BorderPane,
            NavigationMenu,
            NewPublication,
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

<style scoped>

</style>