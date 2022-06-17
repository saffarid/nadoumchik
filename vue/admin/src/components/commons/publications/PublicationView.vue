<template>
    <Popup
            class="publication"
            @close="$emit('close')"
            @keyup.esc="$emit('close')"
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
        setup(props) {
            const articleView = ref(null)

            const refreshContentView = () => {
                if (articleView.value !== null) {
                    articleView.value.innerHTML = props.publication.content.content
                }
            };

            onMounted(refreshContentView)
            watch(props, refreshContentView)

            return {
                articleView,
            }
        }
    }
</script>
