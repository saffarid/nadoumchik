<template>
    <BorderPane>
        <template v-slot:top>
            <TextLabel :label="article.title"/>
        </template>
        <template v-slot:center>
            <TextLabel :label="article.content"/>
        </template>
    </BorderPane>
</template>

<script>
    import {
        BorderPane,
        TextLabel
    } from 'saffarid-ui-kit'
    export default {
        name: "Article",
        components:{
          BorderPane,
            TextLabel
        },
        props:{
            article:{
                type:Object,
                required:true
            }
        }
    }
</script>

<style scoped>

</style>