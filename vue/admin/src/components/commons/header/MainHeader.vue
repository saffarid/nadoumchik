<template>
    <div class="w_bgr">
        <div class="top-header">
            <div class="logo">
                <Logo :height="65" :width="65"/>
                <h1>#НАДОУМЧИК</h1>
            </div>
            <div class="nav-menu">
<!--                <Button v-for="(btn, index) of buttons" :key="index" @click="btn.action">-->
<!--                    <template v-if="btn.img != null">-->
<!--                        <component :is="btn.img" :width="30" :height="30"/>-->
<!--                    </template>-->
<!--                    <span>{{btn.text}}</span>-->
<!--                </Button>-->
            </div>
        </div>
    </div>
</template>

<script>
    import Logo from "@/assets/img/logo";
    import {
        Button
    } from 'saffarid-ui-kit'
    import {
        defineAsyncComponent
    } from 'vue'

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
    .top-header {
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
                    letter-spacing: .05em;
                    font-size: 20px;
                    font-weight: normal;
                    line-height: 20px;
                }
            }
        }
    }

    @media (max-width: 600px) {
        .top-header .logo h1 {
            display: none;
        }

    }
</style>