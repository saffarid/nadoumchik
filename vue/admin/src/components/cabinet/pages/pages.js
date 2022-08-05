import {defineAsyncComponent} from "vue";

const pages = {
    Main: {
        title: 'Главная',
        img: defineAsyncComponent(() => import('@/assets/img/dashboard')),
        workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/main/Main.vue')),
    },
    Publications: {
        title: 'Публикации',
        img: defineAsyncComponent(() => import('@/assets/img/ArticleLogo')),
        workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/publications/Publications.vue')),
    },
    ThemesOfPublications: {
        title: 'Темы публикаций',
        img: defineAsyncComponent(() => import('@/assets/img/empty')),
        workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/themes/ThemesOfPublications.vue')),
    },
    UsersAndGroups: {
        title: 'Пользователи и группы',
        img: defineAsyncComponent(() => import('@/assets/img/user')),
        workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/user_and_groups/UsersAndGroups.vue')),
    },
}

export {
    pages
}