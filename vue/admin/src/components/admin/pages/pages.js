import {defineAsyncComponent} from "vue";

const pages = {
    Main: {
        title: 'Главная',
        img: defineAsyncComponent(() => import('@/assets/img/dashboard')),
        workspace: defineAsyncComponent(() => import('@/components/admin/pages/main/Main.vue')),
    },
    Publications: {
        title: 'Публикации',
        img: defineAsyncComponent(() => import('@/assets/img/ArticleLogo')),
        workspace: defineAsyncComponent(() => import('@/components/admin/pages/publications/Publications.vue')),
    },
    ThemesOfPublications: {
        title: 'Темы публикаций',
        img: defineAsyncComponent(() => import('@/assets/img/empty')),
        workspace: defineAsyncComponent(() => import('@/components/admin/pages/themes/ThemesOfPublications.vue')),
    }
}

export {
    pages
}