module.exports = {

    /**
     * Основные действия
     * */
    ACTS: {
        /**
         * Действие вставки в БД
         * */
        insert: 'insert',
        /**
         * Действие удаления из БД
         * */
        remove: 'remove',
        /**
         * Дейсвие выборки из БД
         * */
        select: 'select',
        /**
         * Действие обновления в БД
         * */
        update: 'update'
    },

    /**
     * Объект описание БД
     * */
    DATABASE: {
        /**
         * Наименование БД
         * */
        name: 'nadoumchik',
        /**
         * Коллеции БД
         * */
        collections: {
            /**
             * Публикации
             * */
            publications: 'publications',
            /**
             * Системные параметры
             * */
            system: 'system',
            /**
             * Категории статей
             * */
            themesOfPublication: 'themesOfPublication',
            /**
             * Категории пользователей
             * */
            roleOfUser: 'roleOfUser',
            /**
             * Пользователи
             * */
            users: 'users'
        },
    },
    /**
     * Модель запросов
     * */
    MODEL_REQUESTS: {
        auth:'/auth',

        // publication:{
        //     insert:`/${super.DATABASE.collections.publications}/${super.ACTS.insert}`,
        //     remove:`/${super.DATABASE.collections.publications}/${super.ACTS.remove}`,
        //     select:`/${super.DATABASE.collections.publications}/${super.ACTS.select}`,
        //     update:`/${super.DATABASE.collections.publications}/${super.ACTS.update}`,
        // },
        //
        // system:{
        //     insert:`/${super.DATABASE.collections.system}/${super.ACTS.insert}`,
        //     select:`/${super.DATABASE.collections.system}/${super.ACTS.select}`,
        //     update:`/${super.DATABASE.collections.system}/${super.ACTS.update}`,
        // },
        //
        // themesOfPublication:{
        //     insert:`/${super.DATABASE.collections.themesOfPublication}/${super.ACTS.insert}`,
        //     remove:`/${super.DATABASE.collections.themesOfPublication}/${super.ACTS.remove}`,
        //     select:`/${super.DATABASE.collections.themesOfPublication}/${super.ACTS.select}`,
        //     update:`/${super.DATABASE.collections.themesOfPublication}/${super.ACTS.update}`,
        // },
        //
        // roleOfUser:{
        //     insert:`/${super.DATABASE.collections.roleOfUser}/${super.ACTS.insert}`,
        //     remove:`/${super.DATABASE.collections.roleOfUser}/${super.ACTS.remove}`,
        //     select:`/${super.DATABASE.collections.roleOfUser}/${super.ACTS.select}`,
        //     update:`/${super.DATABASE.collections.roleOfUser}/${super.ACTS.update}`,
        // },
        //
        // user:{
        //     insert:`/${super.DATABASE.collections.user}/${super.ACTS.insert}`,
        //     remove:`/${super.DATABASE.collections.user}/${super.ACTS.remove}`,
        //     select:`/${super.DATABASE.collections.user}/${super.ACTS.select}`,
        //     update:`/${super.DATABASE.collections.user}/${super.ACTS.update}`,
        // },
        'publications.insert': {
            setUrl: `/publications/insert`
        },
        'publications.remove': {
            setUrl: `/publications/remove`
        },
        'publications.select': {
            getUrl: `/publications/select`
        },
        'publications.update': {
            setUrl: `/publications/update`
        },

        'system.insert': {
            setUrl: `/system/insert`
        },
        'system.select': {
            getUrl: `/system/select`
        },
        'system.update': {
            setUrl: `/system/update`
        },

        'themesOfPublication.insert': {
            setUrl: `/themesOfPublication/insert`
        },
        'themesOfPublication.remove': {
            setUrl: `/themesOfPublication/remove`
        },
        'themesOfPublication.select': {
            getUrl: `/themesOfPublication/select`
        },
        'themesOfPublication.update': {
            setUrl: `/themesOfPublication/update`
        },

        'typeOfUser.insert': {
            setUrl: `/typeOfUser/insert`
        },
        'typeOfUser.remove': {
            setUrl: `/typeOfUser/remove`
        },
        'typeOfUser.select': {
            getUrl: `/typeOfUser/select`
        },
        'typeOfUser.update': {
            setUrl: `/typeOfUser/update`
        },

        'user.insert': {
            setUrl: `/user/insert`
        },
        'user.remove': {
            setUrl: `/user/remove`
        },
        'user.select': {
            getUrl: `/user/select`
        },
        'user.update': {
            setUrl: `/user/update`
        },
    }

}