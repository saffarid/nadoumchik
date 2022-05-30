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
        auth: '/auth',

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
    },
    SCHEMAS_OBJECT: {
        /**
         * Схема публикации в БД
         * */
        publication: {
            /**
             * uuid публикаци
             * */
            _id: {
                type: String,
                required: true
            },
            /**
             * Дата пубдикации статьи
             * */
            dateStamp: {
                type: Date,
                required: true
            },
            /**
             * Кол-во лайков
             * */
            likes: {
                type: Number,
                required: false
            },
            /**
             * Кол-во дизлайков
             * */
            dislikes: {
                type: Number,
                required: false
            },
            /**
             * Кол-во просмотров
             * */
            views: {
                type: Number,
                required: false
            },
            /**
             * Содержимое публикации
             * */
            content: {
                /**
                 * Тип статьи, в это полу устанавливается идентификатор из коллекции typesOfArticles
                 * */
                type: {
                    type: String,
                    required: false
                },
                /**
                 * Заголовок статьи
                 * */
                title: {
                    type: String,
                    required: true
                },
                /**
                 * Основное содержимое статьи
                 * */
                content: {
                    type: String,
                    required: true
                },
            },
            /**
             * Внешнее отображение предпросмотра публикации
             * */
            preview: {
                /**
                 * Флаг положения изображения
                 * */
                imgOnLeft: {
                    type: Boolean,
                    required: true
                },
                /**
                 * Цвет фона
                 * */
                backgroundColor: {
                    type: String,
                    required: true
                },
                /**
                 * Цвет текста
                 * */
                textColor: {
                    type: String,
                    required: true
                },
                /**
                 * Изображение предпросмотра
                 * */
                image: {
                    type: String,
                    required: true
                },
            },
            /**
             * Внешнее отображение публикации
             * */
            view: {
                title: {
                    /**
                     * Использование изображения для заголовка,
                     * true - используется изображение,
                     * false - используется заливка
                     * */
                    useImage: {
                        type: Boolean,
                        required: true
                    },
                    /**
                     * Изображение или заливка заголовка
                     * */
                    image: {
                        type: String,
                        required: false
                    },
                    /**
                     * Высота заголовка
                     * */
                    height: {
                        type: Number,
                        required: true
                    },
                    /**
                     * Оформление текста звголовка
                     * */
                    text: {
                        /**
                         * Цвет текста
                         * */
                        textColor: {
                            type: String,
                            required: true
                        },
                        /**
                         * Шрифт текста
                         * */
                        fontFamily: {
                            type: String,
                            required: true
                        },
                        /**
                         * Вес
                         * */
                        fontWeight: {
                            type: Number,
                            required: true
                        },
                        /**
                         * Стиль
                         * */
                        fontStyle: {
                            type: String,
                            required: true
                        }
                    },
                    /**
                     * Оформление размытой части заголовка
                     * */
                    blur: {
                        /**
                         * Размер
                         * */
                        size: {
                            type: Number,
                            required: false
                        },
                        /**
                         * Степень размытости
                         * */
                        blur: {
                            type: Number,
                            required: false
                        },
                        /**
                         * Позиция по высоте
                         * */
                        position_y: {
                            type: Number,
                            required: false
                        }
                    },
                    /**
                     * Оформление чистой части заголовка
                     * */
                    clear: {
                        /**
                         * Размер
                         * */
                        size: {
                            type: Number,
                            required: false
                        },
                        /**
                         * Положение по оси Y
                         * */
                        position_y: {
                            type: Number,
                            required: false
                        }
                    }
                },
            }
        },
        /**
         * Схема роли пользователя.
         * Роль пользователя представляет права доступа пользователю.
         * */
        roleOfUser:{
            /**
             * uuid роли пользователя
             * */
            _id: {
                type: String,
                required: true
            },
            /**
             * Описание роли пользователя
             * */
            role:{
                /**
                 * Наименование роли
                 * */
                name:{
                    type: String,
                    required: true
                }
            }
        },
        /**
         * Схема тем публикаций
         * */
        themesOfPublication: {
            /**
             * uuid темы публикации
             * */
            _id: {
                type: String,
                required: true
            },
            /**
             * Значение темы публикации
             * */
            value: {
                type: String,
                required: true
            }
        },
        /**
         * Схема пользователя
         * */
        users:{
            /**
             * uuid пользователя
             * */
            _id: {
                type: String,
                required: true
            },
            user: {
                name: {
                    type: String,
                    required: true
                },
                pass: {
                    type: String,
                    required: true
                },
                /**
                 * Идентификатор роли пользователя
                 * */
                role_id: {
                    type: String,
                    required: true
                }
            }
        }
    }
}