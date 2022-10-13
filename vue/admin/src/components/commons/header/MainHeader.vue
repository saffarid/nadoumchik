<template>
    <div class="w_bgr">
        <div class="top-header">
            <div class="logo">
                <Logo :height="65" :width="65"/>
                <h1>#НАДОУМЧИК</h1>
            </div>
            <div class="nav-menu">
                <Button v-for="(btn, index) of buttons" :key="index" @click="btn.action">
                    <template v-if="btn.img != null">
                        <component :is="btn.img" :width="40" :height="40"/>
                    </template>
                    <span>{{btn.text}}</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
    import Logo from "@/assets/img/logo";
    import {
        Button
    }           from 'saffarid-ui-kit'
    import {
        defineAsyncComponent
    }           from 'vue'

    export default {
        name: "MainHeader",
        components: {
            Button,
            Logo
        },
        setup() {
            const buttons = [
                {
                    text: 'Темы',
                    action: () => {
                    },
                    img: defineAsyncComponent(() => import('@/assets/img/SvgMenu'))
                },
                {
                    text: 'Лучшее',
                    action: () => {
                    },
                    img: null
                },
            ]
            return {
                buttons
            }
        }
    }
</script>

<style lang="scss" scoped>
    .w_bgr {
        background-color: var(--background);
        width: calc(100vw - 10px);
        padding: 5px;
        position: sticky;
        top: 0px;
        z-index: 50;
    }

    .top-header {
        height: 65px;
        display: flex;
        background-color: var(--primary_color);
        border-radius: 5px;
        align-items: center;
        align-content: center;
        align-self: stretch;
        column-gap: 5px;

        .logo {
            display: flex;
            align-items: center;

            h1 {
                margin: 0;
                font-size: 25px;
                font-weight: normal;
            }
        }

        .nav-menu {
            display: flex;
            align-items: center;
            align-content: center;
            align-self: stretch;

            .button {
                display: flex;
                align-items: center;
                align-content: center;
                align-self: stretch;
                padding: 10px;

                span {
                    font-size: 25px;
                    font-weight: normal;
                }
            }

        }
    }

    @media (max-width: 600px) {
        .top-header {
            height: auto;
            display: block;
            row-gap: 2px;
        }
    }
</style>