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
             * Статьи
             * */
            articles: 'articles',
            /**
             * Категории статей
             * */
            typeOfArticle: 'typeOfArticle',
            /**
             * Категории пользователей
             * */
            typeOfUser: 'typeOfUser',
            /**
             * Пользователи
             * */
            users: 'users',
            /**
             * Описание правил отображения статей в списке
             * */
            viewArticle: 'viewArticle'
        },
    },
    /**
     * Модель запросов
     * */
    MODEL_REQUESTS: {
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