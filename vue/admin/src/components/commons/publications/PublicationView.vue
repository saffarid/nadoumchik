<template>
    <Popup
            class="publication"
            @close="close"
            @keypress.esc="close">
        <template v-slot:default>
            <Title :publication="publication"/>
            <div class="publication-content" ref="articleView">
            </div>
        </template>
    </Popup>
    <div class="close">
        <SvgClose
                @click="close"
                :fill="'#a5a5a5'"
                :height="40"
                :width="40"
        />
    </div>

</template>

<script>
    import {
        onMounted,
        ref,
        watch
    }               from "vue";
    import {
        Popup,
    }               from 'saffarid-ui-kit'
    import Title    from "@/components/commons/publications/Title";
    import SvgClose from "@/assets/img/SvgClose";

    export default {
        name: "PublicationView",
        components: {
            SvgClose,
            Title,
            Popup,
        },
        props: {
            publication: {
                type: Object,
                required: true
            }
        },
        setup(props, context) {
            const articleView = ref(null)

            const refreshContentView = () => {
                if (articleView.value !== null) {
                    articleView.value.innerHTML = props.publication.content.content
                }
            };

            onMounted(refreshContentView)
            watch(props, refreshContentView)

            const close = () => {
                context.emit('close')
            }

            return {
                articleView,
                close,
            }
        }
    }
</script>

<style lang="scss">

    .close {
        display: none;
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 101;
        border-radius: 50%;
        border: 2px #a5a5a5 solid;
    }

    .publication {
        z-index: 100;
        overflow-y: auto;
        height: 100%;
        width: 100vw !important;
        position: fixed !important;
        background-color: rgba(64, 64, 64, 0.95) !important;

        .closer {
            z-index: 1;
        }

        .popup-body {
            margin: 0 5px;
            width: 800px;
            min-height: 98vh;
            height: min-content;
            max-height: 100%;
            grid-template-rows: min-content auto 50px;
            padding: 0;
            z-index: 2;

            .header {
                font-size: 30px;
                display: grid;
                align-self: stretch;
                justify-self: stretch;
                align-content: stretch;
                justify-content: stretch;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                padding: 0;
            }

            .publication-content {
                padding: 0 5px;
                width: 790px;
            }

            .content {
                margin-top: 5px;
                padding-right: 5px;
                padding-bottom: 5px;
                padding-left: 5px;
                max-height: 100%;
            }

        }
    }

    @media (max-width: 810px) {
        .close {
            display: grid;
        }

        .publication .popup-body {
            width: 98.765vw;
            margin: 5px;

            .publication-content {
                width: calc(98.765vw - 10px);
            }
        }
    }

    @media (max-width: 768px) {

        .publication .popup-body {
            margin: 0;
            width: 100vw;
            border-radius: 0;

            .publication-content {
                width: calc(100vw - 10px);
            }

            .blur {
                border-radius: 0;

                .clear {
                    border-radius: 0;
                }
            }
        }
    }

    @media (max-width: 610px) {
        .publication-content {
            img {
                height: auto;
                width: 100%;
            }
        }
    }


</style>