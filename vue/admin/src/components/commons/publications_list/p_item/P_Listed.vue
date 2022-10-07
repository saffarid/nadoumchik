<template>
    <div @click="$emit('read')"
         @mouseenter="isAnimFrom = true"
         @mouseleave="isAnimFrom = false"
         :class="{'image_left':data.onLeft, 'image_right':!data.onLeft}"
         class="p_item"
         :style="styleVars">
        <div :class="{'mouse_enter':isAnimFrom && isAnimFrom !== null, 'mouse_leave':!isAnimFrom && isAnimFrom !== null}"
             class="image">
<!--            <img :src="data.publication.preview.image" :height="140" :width="140"/>-->
        </div>
        <div class="text">
            <span :class="{'mouse_enter':isAnimFrom && isAnimFrom !== null, 'mouse-leave':!isAnimFrom && isAnimFrom !== null}">
                {{data.publication.content.title.toUpperCase()}}
            </span>
            <span>{{`${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`}}</span>
        </div>
    </div>
</template>

<script>
    import {
        ref,
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

            const styleVars = {
                '--img': `url(${props.data.publication.preview.image})`,
                '--background': props.data.publication.preview.backgroundColor,
                '--color': props.data.publication.preview.textColor,
                '--scale_to': 1.075,
                '--scale_from': 1,
                '--scale_time': '0.5s',
            }

            return {
                date,
                isAnimFrom,
                styleVars
            }
        }
    }
</script>

<style lang="scss">
    .image_left {
        grid-template-areas: "image text";
        grid-template-columns: var(--publication_item_h) calc(100% - var(--publication_item_h));
    }

    .image_right {
        grid-template-areas: "text image";
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

    .mouse_leave {
        animation: transform-scale-from var(--scale_time);
        transform: scale(var(--scale_from));
    }

    .mouse_enter {
        animation: transform-scale-to var(--scale_time);
        transform: scale(var(--scale_to));
    }

    .p_item {
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

    }
</style>