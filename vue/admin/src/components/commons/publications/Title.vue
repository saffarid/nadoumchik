<template>
    <div
            class="title"
            :style="styleTitleVar"
    >
        <div class="title_clear_image"></div>
        <div class="caption">
            <h1>{{publication.content.title}}</h1>
        </div>
        <div class="subcaption">
            <div class="author"><span>{{publication.author.personal.nickname}}</span></div>
            <div></div>
            <div class="theme"><span>{{publication.theme.value}}</span></div>
            <div class="date"><span>{{datePublication}}</span></div>
        </div>
    </div>
</template>

<script>
    import {onMounted, reactive, watch} from "vue";
    import {fonts}                      from "@/js/fonts";

    export default {
        name: "Title",
        props: {
            publication: {
                type: Object,
                required: true
            }
        },
        setup(props) {

            let date = new Date(props.publication.dateStamp)
            const styleTitleVar = reactive({
                '--img': `url(${props.publication.view.title.image.src})`,
                '--position-y': props.publication.view.title.image.position_y + '%',
                '--text-title-color': props.publication.view.title.text.textColor,
                '--font-family': fonts[props.publication.view.title.text.fontFamily],
                '--font-weight': props.publication.view.title.text.fontWeight,
                '--font-style': props.publication.view.title.text.fontStyle,
            })

            const refreshContentView = () => {
                if (props.publication.view != undefined) {
                    styleTitleVar['--text-title-color'] = props.publication.view.title.text.textColor
                    styleTitleVar['--position-y'] = props.publication.view.title.image.position_y + '%'
                    styleTitleVar['--font-family'] = fonts[props.publication.view.title.text.fontFamily]
                    styleTitleVar['--font-weight'] = props.publication.view.title.text.fontWeight
                    styleTitleVar['--font-style'] = props.publication.view.title.text.fontStyle

                    if (props.publication.view.title.image.src !== undefined && props.publication.view.title.useImage) {
                        styleTitleVar['--img'] = `url(${props.publication.view.title.image.src})`
                    }
                    else {
                        styleTitleVar['--img'] = `${props.publication.view.title.image.src}`
                    }
                }
            };

            onMounted(refreshContentView)
            watch(props, refreshContentView)

            return {
                datePublication: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
                styleTitleVar
            }
        }
    }
</script>

<style lang="scss" scoped>

    $border_radius: 10px;

    .title {
        display: grid;
        align-content: end;
        justify-content: stretch;

        grid-template-rows: auto 50px;

        height: 250px;
        border-top-left-radius: $border_radius;
        border-top-right-radius: $border_radius;

        background: var(--img);
        background-repeat: no-repeat;

        background-size: 100% 100%;

        row-gap: 2px;

        position: relative;

        .title_clear_image {
            position: absolute;

            backdrop-filter: blur(10px);

            height: 100%;
            width: 100%;

            background: var(--img);
            background-position-y: var(--position-y);
            background-repeat: no-repeat;
            background-size: 100% auto;
        }

        .caption {
            display: grid;
            justify-content: center;
            align-content: center;
            z-index: 1;

            h1 {
                margin: 0;
                padding: 0;
                font-family: var(--font-family);
                font-weight: var(--font-weight);
                font-style: var(--font-style);
                font-size: 30px;
                text-align: center;
                color: var(--text-title-color);
                word-break: break-word;
                overflow-wrap: break-word;
                hyphens: auto;
            }
        }

        .subcaption {
            z-index: 1;
            display: grid;
            grid-template-areas: 'author author' 'theme date';
            grid-template-columns: repeat(2, minmax(190px, 1fr));
            grid-template-rows: repeat(2, 20px);
            justify-content: center;
            justify-self: center;
            align-content: center;
            column-gap: 5px;
            max-width: 500px;

            .author {
                grid-area: author;
            }

            .theme {
                grid-area: theme;
            }

            .date {
                grid-area: date;
            }

            span {
                font-size: 15px;
                letter-spacing: .1em;
                color: var(--text-title-color);
                font-family: var(--font-family);
            }
        }

    }

    @media (max-width: 768px) {
        .title {
            height: 200px;

            h1 {
                font-size: 20px;
            }
        }
    }

    @media (max-width: 425px) {
        .title {
            .title_clear_image {
                background-size: auto 100%;
                background-position-y: center;
                background-position-x: center;
            }

            h1 {
                font-size: 20px;
            }
        }
    }

</style>