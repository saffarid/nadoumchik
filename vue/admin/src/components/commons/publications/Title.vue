<template>
    <div
            class="title blur"
            :style="styleTitleVar"
    >
        <div class="clear">
            <h1>
                {{publication.content.title.toUpperCase()}}
            </h1>
        </div>
    </div>
</template>

<script>
    import {onMounted, reactive, watch} from "vue";
    import {fonts} from "@/js/fonts";

    export default {
        name: "Title",
        props: {
            publication: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const font = fonts
            const localPublication = reactive(props.publication)
            const styleTitleVar = reactive({
                '--img': `url(${localPublication.view.title.image})`,
                '--blur-size': localPublication.view.title.blur.size + '%',
                '--blur-position-y': localPublication.view.title.blur.position_y + '%',
                '--blur': localPublication.view.title.blur.blur + 'px',
                '--size': localPublication.view.title.clear.size + '%',
                '--position-y': localPublication.view.title.clear.position_y + '%',
                '--height': localPublication.view.title.height + 'px',
                '--text-title-color': localPublication.view.title.text.textColor,
                '--font-family': font[localPublication.view.title.text.fontFamily],
                '--font-weight': localPublication.view.title.text.fontWeight,
                '--font-style': localPublication.view.title.text.fontStyle,
            })

            const refreshContentView = () => {
                styleTitleVar['--blur-size'] = localPublication.view.title.blur.size + '%'
                styleTitleVar['--text-title-color'] = localPublication.view.title.text.textColor
                styleTitleVar['--blur-position-y'] = localPublication.view.title.blur.position_y + '%'
                styleTitleVar['--blur'] = localPublication.view.title.blur.blur + 'px'
                styleTitleVar['--size'] = localPublication.view.title.clear.size + '%'
                styleTitleVar['--position-y'] = localPublication.view.title.clear.position_y + '%'
                styleTitleVar['--height'] = localPublication.view.title.height + 'px'
                styleTitleVar['--font-family'] = font[localPublication.view.title.text.fontFamily]
                styleTitleVar['--font-weight'] = localPublication.view.title.text.fontWeight
                styleTitleVar['--font-style'] = localPublication.view.title.text.fontStyle

                if (localPublication.view.title.image !== undefined && localPublication.view.title.useImage) {
                    styleTitleVar['--img'] = `url(${localPublication.view.title.image})`
                } else {
                    styleTitleVar['--img'] = `${localPublication.view.title.image}`
                }
            };

            onMounted(refreshContentView)
            watch(localPublication, refreshContentView)

            return {
                localPublication,
                styleTitleVar
            }
        }
    }
</script>

<style lang="scss" scoped>

    .title {
        display: grid;
        min-height: var(--height);
        max-height: min-content;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;

        h1 {
            margin: 0;
            padding: 0;
            font-family: var(--font-family);
            font-weight: var(--font-weight);
            font-style: var(--font-style);
            font-size: 50px;
            text-align: center;
            color: var(--text-title-color);
        }
    }

    .blur {
        align-content: stretch;
        justify-content: stretch;
        background: var(--img);
        background-repeat: no-repeat;
        background-position-x: center;
        background-size: 100%;
        background-position-y: var(--blur-position-y);
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;

        .clear {
            display: grid;
            align-content: center;
            justify-content: center;
            backdrop-filter: blur(var(--blur));
            background: var(--img);
            background-repeat: no-repeat;
            background-position-x: center;
            background-size: var(--size);
            background-position-y: var(--position-y);
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
        }
    }

</style>