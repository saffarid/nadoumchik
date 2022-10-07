<template>
    <Popup
            class="publication"
            @close="close"
            @keypress.esc="close"
    >
        <template v-slot:header>
            <Title :publication="publication"/>
        </template>
        <template v-slot:content>
            <div ref="articleView">
            </div>
        </template>
    </Popup>
</template>

<script>
    import {
        onMounted,
        ref,
        watch
    }            from "vue";
    import {
        Popup,
    }            from 'saffarid-ui-kit'
    import Title from "@/components/commons/publications/Title";

    export default {
        name: "PublicationView",
        components: {
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
                close
            }
        }
    }
</script>

<style lang="scss">
    .publication {
        z-index: 100;
        overflow-y: auto;
        height: min-content;
        min-height: 98vh;
        max-height: 100%;

        .popup {
            margin: 5px;
            min-height: 98vh;
            height: min-content;
            max-height: 100%;
            grid-template-rows: min-content auto 50px;

            .popup_header {
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

            .content {
                margin-top: 5px;
                padding-right: 5px;
                padding-bottom: 5px;
                padding-left: 5px;
                max-height: 100%;
            }
        }
    }

</style>