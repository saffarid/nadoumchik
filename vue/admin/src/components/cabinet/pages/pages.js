import api                    from "../../../../../../app/api/api_desc"
import {defineAsyncComponent} from "vue";

const getPages = (user) => {
    const res = {
        Main: {
            title: 'Главная',
            img: defineAsyncComponent(() => import('@/assets/img/dashboard')),
            workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/main/Main.vue')),
        }
    }

    if (user.group.rights.publications.value != api.ACCESS_RIGHTS.NotAllow) {
        res['Publications'] = {
            title: 'Публикации',
            img: defineAsyncComponent(() => import('@/assets/img/ArticleLogo')),
            workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/publications/Publications.vue')),
        }
    }

    if (user.group.rights.themesOfPublication.value != api.ACCESS_RIGHTS.NotAllow) {
        res['ThemesOfPublications'] = {
            title: 'Темы публикаций',
                img: defineAsyncComponent(() => import('@/assets/img/empty')),
                workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/themes/ThemesOfPublications.vue')),
        }
    }

    if (user.group.rights.users.value != api.ACCESS_RIGHTS.NotAllow || user.group.rights.groups.value != api.ACCESS_RIGHTS.NotAllow) {
        res['UsersAndGroups'] = {
            title: 'Пользователи и группы',
            img: defineAsyncComponent(() => import('@/assets/img/users')),
            workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/user_and_groups/UsersAndGroups.vue')),
        }
    }
    // res['User'] = {
    //     title: 'Персональные настройки',
    //     img: defineAsyncComponent(() => import('@/assets/img/user')),
    //     workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/user/User.vue')),
    // }
    if (user.group.rights.system.value != api.ACCESS_RIGHTS.NotAllow) {
        res['System'] = {
            title: 'Системные настройки',
            img: defineAsyncComponent(() => import('@/assets/img/settings')),
            workspace: defineAsyncComponent(() => import('@/components/cabinet/pages/system/System.vue')),
        }
    }


    return res
}

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
    pages,
    getPages
}