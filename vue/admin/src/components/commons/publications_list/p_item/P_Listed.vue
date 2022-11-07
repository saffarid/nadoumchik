<template>
    <div @click="$emit('read')"
         @mouseenter="isAnimFrom = true"
         @mouseleave="isAnimFrom = false"
         :class="{'image-left':data.onLeft, 'image-right':!data.onLeft}"
         class="p-item"
         :style="styleVars">
        <div :class="{'mouse-enter':isAnimFrom && isAnimFrom !== null, 'mouse-leave':!isAnimFrom && isAnimFrom !== null}"
             class="image">
        </div>
        <div class="desc">

            <div class="caption">
                <h1 :class="{'mouse-enter':isAnimFrom && isAnimFrom !== null, 'mouse-leave':!isAnimFrom && isAnimFrom !== null}">
                    {{data.publication.content.title}}
                </h1>
            </div>
            <div class="subcaption">
                <div class="view"></div>
                <div class="theme">
                    <span>{{`${data.publication.theme.major.value} ${data.publication.theme.minor.value ? '/ '+data.publication.theme.minor.value : ''}`}}</span>
                </div>
                <div class="author">
                    <span>{{`${data.publication.author.personal.s_name} ${data.publication.author.personal.f_name}`}}</span>
                </div>
            </div>
            <div class="date">
                <span>{{datePublication}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        reactive,
        ref,
        watch
    } from 'vue'

    export default {
        name: "P_Listed",
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const isAnimFrom = ref(null)
            let date = new Date(props.data.publication.dateStamp)

            const styleVars = reactive({
                '--img': `url(${props.data.publication.preview.image})`,
                '--background': props.data.publication.preview.backgroundColor,
                '--color': props.data.publication.preview.textColor,
                '--scale_to': 1.075,
                '--scale_from': 1,
                '--scale_time': '0.5s',
            })

            watch(props, () => {
                if (props.data.publication.preview != undefined) {
                    styleVars['--img'] = `url(${props.data.publication.preview.image})`
                    styleVars['--background'] = props.data.publication.preview.backgroundColor
                    styleVars['--color'] = props.data.publication.preview.textColor
                }
                styleVars['--scale_to'] = 1.075
                styleVars['--scale_from'] = 1
                styleVars['--scale_time'] = '0.5s'
            })

            return {
                datePublication: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
                isAnimFrom,
                styleVars
            }
        }
    }
</script>

<style lang="scss">
    .image-left {
        grid-template-areas: "image desc";
        grid-template-columns: var(--publication_item_h) calc(100% - var(--publication_item_h));
    }

    .image-right {
        grid-template-areas: "desc image";
        grid-template-columns: calc(100% - var(--publication_item_h)) var(--publication_item_h);
    }

    @keyframes transform-scale-to {
        from {
            transform: scale(var(--scale_from))
        }
        to {
            transform: scale(var(--scale_to))
        }
    }

    @keyframes transform-scale-from {
        from {
            transform: scale(var(--scale_to))
        }
        to {
            transform: scale(var(--scale_from))
        }
    }

    .mouse-leave {
        animation: transform-scale-from var(--scale_time);
        transform: scale(var(--scale_from));
    }

    .mouse-enter {
        animation: transform-scale-to var(--scale_time);
        transform: scale(var(--scale_to));
    }

    .p-item {
        display: grid;
        padding: 0;
        margin: 0;
        align-content: stretch;
        align-items: stretch;

        height: var(--publication_item_h);

        background-color: var(--background);

        .image {
            display: grid;
            grid-area: image;
            align-content: stretch;
            justify-content: stretch;
            align-self: stretch;
            justify-self: stretch;
            background: var(--img);
            background-size: 100% 100%;
        }

        .desc {
            display: grid;
            /*align-self: stretch;*/
            /*align-items: end;*/

            justify-self: center;
            width: 90%;
            position: relative;

            h1 {
                color: var(--color);
                font-size: 20px;
                letter-spacing: .1em;
                text-align: center;
            }

            span {
                color: var(--color);
                font-size: 12px;
                letter-spacing: .1em;
            }

            .caption {
                display: grid;
                align-content: center;
                justify-content: stretch;
                justify-items: center;
            }

            .subcaption {
                display: flex;
                align-content: center;
                align-items: center;
                justify-content: end;
                column-gap: 5px;

                position: absolute;
                bottom: 25px;
                right: 10px;
                height: 20px;
            }

            .date {
                position: absolute;
                bottom: 10px;
                right: 10px;
                height: 20px;
            }
        }
    }

    @media (max-width: 600px) {
        h1 {
            font-size: 15px;
        }
    }

    @media (max-width: 425px) {
        .p-item {
            .desc {
                span {
                    font-size: 10px;
                }
                .caption {
                    position: absolute;
                    h1 {
                        font-size: 3vw;
                    }
                }
                .subcaption {
                    bottom: 10px;
                    left: 10px;
                    right: auto;
                }
                .date {
                }
            }
        }
    }
</style>