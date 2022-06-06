<template>
    <div @click="$emit('click', publication)"
         @mouseenter="isAnimFrom = true"
         @mouseleave="isAnimFrom = false"
         :class="{'image-left':(publication.preview.imgOnLeft || canEdit), 'image-right':(!publication.preview.imgOnLeft && !canEdit)}"
         class="publication-item"
         :style="`background-color:${publication.preview.backgroundColor}`">
        <div
                :class="{'mouse-enter':isAnimFrom && isAnimFrom !== null && !canEdit, 'mouse-leave':!isAnimFrom && isAnimFrom !== null && !canEdit}"
                class="image">
            <ArticleLogo v-if="!publication.preview.image" :height="140" :width="140"/>
            <img v-else :src="publication.preview.image" :height="140" :width="140"/>
        </div>
        <div
                class="text">
            <TextLabel
                    :class="{'mouse-enter':isAnimFrom && isAnimFrom !== null && !canEdit, 'mouse-leave':!isAnimFrom && isAnimFrom !== null && !canEdit}"
                    :label="publication.content.title.toUpperCase()" :style="`color: ${publication.preview.textColor}`"
                    style="position: relative; top: 10px"
            />
            <TextLabel :label="`${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`" :style="`color: ${publication.preview.textColor}`"/>
        </div>
        <div
                class="buttons"
                v-if="canEdit">
            <Button class="image-button" @click="$emit('remove')">
                <trash :height="20" :width="20"/>
            </Button>
            <Button class="image-button" @click="$emit('edit')">
                <edit :height="20" :width="20"/>
            </Button>
        </div>
    </div>
</template>

<script>
    import {
        ref
    } from 'vue'
    import {
        Button,
        TextLabel
    } from 'saffarid-ui-kit'
    import ArticleLogo from "@/assets/img/ArticleLogo";
    import trash from "@/assets/img/trash";
    import edit from "@/assets/img/edit";

    export default {
        name: "PublicationItem",
        components: {
            Button,
            trash,
            edit,
            ArticleLogo,
            TextLabel
        },
        emits: [
            'remove'
        ],
        props: {
            publication: {
                type: Object,
                required: true
            },
            canEdit: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        setup(props) {
            const isAnimFrom = ref(null)
            console.log(props.publication)
            let date = new Date(props.publication.dateStamp)

            return {
                date,
                isAnimFrom
            }
        }
    }
</script>
