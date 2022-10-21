<template>
    <div @click="$emit('read')"
         class="n_p_item"
         :style="styleVars">
        <div class="p_image"></div>
        <div class="p_title">
            <h1>{{data.publication.content.title}}</h1>
        </div>
        <div class="p_desc">
            <div class="p_author">
                <span>{{data.publication.author.personal.nickname}}</span>
            </div>
            <div class="p_theme_date">
                <div class="p_theme">
                    <span>{{data.publication.theme.value}}</span>
                </div>
                <div class="p_date">
                    <span>{{datePublication}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        reactive
    } from 'vue'

    export default {
        name: "P_New",
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            let date = new Date(props.data.publication.dateStamp)
            const imgSize = reactive({
                width: 250,
                height: 300
            })
            const styleVars = reactive({
                '--img': `url(${props.data.publication.preview.image})`,
                '--color': props.data.publication.preview.textColor,
            })
            return {
                datePublication: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
                imgSize,
                styleVars
            }
        }
    }
</script>

<style lang="scss">


    .n_p_item {
        display: grid;
        min-height: 350px;
        height: 100%;
        min-width: 200px;
        width: 100%;
        position: relative;
        gap: 10px;
        border-radius: 5px;

        span, h1 {
            color: var(--color);
            cursor: default;
        }

        .p_image {
            display: grid;
            align-self: stretch;
            justify-self: stretch;
            position: absolute;
            z-index: 1;
            height: 100%;
            width: 100%;
            background: var(--img);
            background-size: 100% 100%;
            border-radius: 5px;
        }

        .p_title {
            display: grid;
            justify-content: center;
            justify-items: center;

            position: absolute;

            bottom: 60px;
            left: 10px;

            z-index: 10;

            h1 {
                font-size: 20px;
            }

        }

        .p_desc {
            display: grid;

            justify-self: stretch;
            align-self: end;

            z-index: 2;

            color: white;
            position: relative;

            padding: 0 10px 10px 10px;

            .p_theme_date {
                display: flex;
                justify-content: space-between;
            }


        }

    }

</style>