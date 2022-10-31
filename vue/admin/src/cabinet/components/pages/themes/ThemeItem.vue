<template>
    <div class="theme-item">
        <span>{{theme.value}}</span>
        <Button class="image-button" @click="$emit('edit')">
            <edit :width="20" :height="20"/>
        </Button>
        <Button class="image-button" @click="$emit('remove')">
            <trash :width="20" :height="20"/>
        </Button>
    </div>
</template>

<script>
    import {
        Button,
        TextLabel
    }            from 'saffarid-ui-kit'
    import Edit  from "@/assets/img/edit";
    import Trash from "@/assets/img/trash";

    export default {
        name: "ThemeItem",
        components: {
            Trash,
            Edit,
            Button,
            TextLabel
        },
        props:{
            theme:{
                type: Object,
                required: true
            }
        },
    }
</script>

<style lang="scss" scoped>

    .theme-item {
        align-content: center;
        align-items: center;
        border-radius: 5px;
        display: grid;
        grid-template-columns: 300px auto auto;
        width: fit-content;
        column-gap: 5px;
        padding: 5px;

        .image-button{
            opacity: 0;
        }

        &:hover{
            background-color: #888888;
            .image-button{
                opacity: 1;
            }
        }


    }
</style>