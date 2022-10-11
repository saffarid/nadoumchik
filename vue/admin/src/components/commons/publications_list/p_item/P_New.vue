<template>
    <div @click="$emit('read')"
         class="n_p_item"
        :style="styleVars">
        <div class="p_image">
<!--            <img :src="data.publication.preview.image"/>-->
        </div>
        <div class="p_desc">
            <div class="p_title">
                <span>{{data.publication.content.title.toUpperCase()}}</span>
            </div>
            <div class="p_theme">
                <span>{{data.publication.theme.value.toUpperCase()}}</span>
            </div>
            <div class="p_date">
                <span>{{`${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`}}</span>
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
                '--img': `url(${props.data.publication.preview.image})`
            })
            return {
                date,
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

        .p_desc {
            display: grid;

            justify-self: stretch;
            align-self: end;

            z-index: 2;

            color: white;
        }

    }
</style>