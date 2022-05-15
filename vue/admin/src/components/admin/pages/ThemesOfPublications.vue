<template>
    <BorderPane class="themes-of-publications">
        <template v-slot:top>
            <div class="edit-category">
                <TextField v-model="localCategory.value"/>
                <Button text="ОТПРАВИТЬ" @click="sendCategory"/>
            </div>
        </template>
        <template v-slot:center>
            <div v-if="isReady">
                <div class="theme-of-publications" v-for="(category, index) in categories" :key="index">
                    <TextLabel :label="category.value"/>
                    <Button text="Удалить" @click="removeCategory(category)"/>
                    <Button text="Редактировать" @click="updateCategory(category)"/>
                </div>
            </div>
            <div v-else>
                Загрузка...
            </div>
        </template>
    </BorderPane>
</template>

<script>
    import {asyncRequest} from "@/js/web";
    import {
        BorderPane,
        Button,
        TextField,
        TextLabel
    } from 'saffarid-ui-kit'
    import {
        ref,
        reactive
    } from 'vue'

    export default {
        name: "ThemesOfPublications",
        components: {
            BorderPane,
            Button,
            TextField,
            TextLabel
        },
        setup() {
            const isReady = ref(false)
            const categories = reactive([])
            const localCategory = reactive({
                _id: undefined,
                value: 'Write your category here'
            })

            const loadCategories = () => {
                asyncRequest('/themesOfPublication/select', JSON.stringify({}))
                    .then(data => {
                        categories.length = 0
                        data.forEach((category) => {
                            categories.push(category)
                        })
                        isReady.value = true
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            loadCategories()

            const sendCategory = () => {
                if (localCategory._id){
                    asyncRequest('/themesOfPublication/update', JSON.stringify(localCategory))
                        .then(() => loadCategories())
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    asyncRequest('/themesOfPublication/insert', JSON.stringify(localCategory))
                        .then(() => loadCategories())
                        .catch(err => {
                            console.log(err)
                        })
                }
            }

            const updateCategory = (category) => {
                localCategory._id = category._id
                localCategory.value = category.value
            }

            const removeCategory = (category) => {
                asyncRequest('/themesOfPublication/remove', JSON.stringify(category))
                    .then(() => loadCategories())
                    .catch(err => {
                        console.log(err)
                    })
            }

            return {
                categories,
                isReady,
                localCategory,
                sendCategory,
                removeCategory,
                updateCategory
            }
        }
    }
</script>

<style scoped>

</style>