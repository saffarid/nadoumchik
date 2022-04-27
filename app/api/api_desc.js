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
        name: 'nadoumchik_db',
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
        'article.insert': {
            setUrl: `/article/insert`
        },
        'article.remove': {
            setUrl: `/article/remove`
        },
        'article.select': {
            getUrl: `/article/select`
        },
        'article.update': {
            setUrl: `/article/update`
        },

        'typeOfArticle.insert': {
            setUrl: `/typeOfArticle/insert`
        },
        'typeOfArticle.remove': {
            setUrl: `/typeOfArticle/remove`
        },
        'typeOfArticle.select': {
            getUrl: `/typeOfArticle/select`
        },
        'typeOfArticle.update': {
            setUrl: `/typeOfArticle/update`
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

        'viewArticle.insert': {
            setUrl: `/viewArticle/insert`
        },
        'viewArticle.remove': {
            setUrl: `/viewArticle/remove`
        },
        'viewArticle.select': {
            getUrl: `/viewArticle/select`
        },
        'viewArticle.update': {
            setUrl: `/viewArticle/update`
        },
    }

}