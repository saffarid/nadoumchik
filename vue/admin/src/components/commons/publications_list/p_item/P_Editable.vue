<template>
    <div @click="$emit('read')"
         @mouseenter="isAnimFrom = true"
         @mouseleave="isAnimFrom = false"
         class="publication-item"
         :style="styleVars">
        <div class="image">
            <ArticleLogo v-if="!data.publication.preview.image" :height="140" :width="140"/>
            <img v-else :src="data.publication.preview.image" :height="140" :width="140"/>
        </div>
        <div class="text">
            <span>{{data.publication.content.title.toUpperCase()}}</span>
            <span>{{`${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`}}</span>
        </div>
        <div class="buttons">
            <Button class="image-button" @click="$emit('remove')">
                <trash :height="20" :width="20" />
            </Button>
            <Button class="image-button" @click="$emit('edit')">
                <edit :height="20" :width="20" />
            </Button>
        </div>
    </div>
</template>

<script>
    import {
        ref,
        reactive,
        watch,
        onMounted
    } from 'vue'
    import {
        Button,
    } from 'saffarid-ui-kit'
    import ArticleLogo from "@/assets/img/ArticleLogo";
    import trash from "@/assets/img/trash";
    import edit from "@/assets/img/edit";

    export default {
        name: "P_Editable",
        components: {
            Button,
            trash,
            edit,
            ArticleLogo,
        },
        props: {
            data:{
                type: Object,
                required: true
            }
        },
        setup(props) {
            const isAnimFrom = ref(null)
            let date = new Date(props.data.publication.dateStamp)

            const styleVars = reactive({
                '--background' : props.data.publication.preview.backgroundColor,
                '--color' : props.data.publication.preview.textColor
            })

            const refreshContentView = () => {
                styleVars['--background'] = props.data.publication.preview.backgroundColor
                styleVars['--color'] = props.data.publication.preview.textColor
            }

            onMounted(refreshContentView)
            watch(props, refreshContentView)

            return {
                date,
                isAnimFrom,
                styleVars
            }
        }
    }
</script>

<style lang="scss" scoped>

    .publication-item {
        display: grid;
        grid-template-areas: "image text buttons";
        grid-template-columns: var(--publication_item_h) auto min-content;
        padding: 0;
        margin: 0;
        align-content: center;
        align-items: center;
        height: var(--publication_item_h);
        width: 650px;
        background-color: var(--background);

        .image {
            display: grid;
            grid-area: image;
            width: var(--publication_item_h);
            height: var(--publication_item_h);
            align-content: center;
            justify-content: center;
        }

        .text {
            grid-area: text;
            display: grid;
            padding: 15px;
            align-self: stretch;
            align-items: end;
            justify-content: stretch;
            justify-items: stretch;
            justify-self: stretch;

            span {
                color: var(--color);
                text-align: center;
                position: relative;
                top: 10px
            }
        }

        .buttons {
            grid-area: buttons;
            display: grid;
            opacity: 0;
            padding: 5px;
            align-items: center;
            justify-items: center;
            row-gap: 5px;

            .image-button {
                svg {
                    fill: var(--color);
                }

                &:hover {
                    svg {
                        fill: white;
                    }
                }
            }
        }

        &:hover {
            .buttons {
                opacity: 1;
            }
        }
    }
</style>