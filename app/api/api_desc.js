// import work_object from "../js/work_object";
const work_object = require('../js/work_object')

module.exports = {
    work_object,
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
     * Заготовки тел заросов
     * */
    BODY_REQUEST:{
      termsSampling:{
          shift:0,
          count:0
      }
    },
    /**
     * Тело ответа
     * */
    BODY_RESPONSE:{
        /**
         * Код ответа
         * */
        responseCode:-1,
        /**
         * Сообщение
         * */
        message: '',
        /**
         * Передаваемые данные
         * */
        datas:{
            /**
             * Найденные, по запросу, документы
             * */
            findings: [],
            /**
             * Флаг наличия ещё не прочитанных документов
             * */
            thereIsMore: false
        }
    },
    /**
     * Объект описание БД
     * */
    DATABASE: {
        /**
         * Наименование БД
         * */
        name: 'nadoumchick',
        /**
         * Коллеции БД
         * */
        collections: {
            /**
             * Публикации
             * */
            publications: {
                /**
                 * Наименование
                 * */
                name: 'publications',
                /**
                 * Схема публикации в БД
                 * */
                schema: {
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
                     * Тема публикации
                     * */
                    theme:{
                      type: String,
                      ref: 'themesOfPublication',
                      required: true
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
                 * Заготовка для создания новых объектов
                 * */
                newObject: {
                    dateStamp: new Date(),
                    theme: null,
                    content: {
                        title: 'Your title is here',
                        content: 'Your publication`s content is here'
                    },
                    preview: {
                        imgOnLeft: true,
                        backgroundColor: '#B7AEAE',
                        textColor: '#ff5d5d',
                        image: ''
                    },
                    view: {
                        title: {
                            useImage: false,
                            height: 150,
                            image: '#724242',
                            text: {
                                textColor: '#2b2b2b',
                                fontFamily: 'YST',
                                fontWeight: 400,
                                fontStyle: 'normal'
                            },
                            blur: {
                                size: 100,
                                blur: 10,
                                position_y: 50
                            },
                            clear: {
                                size: 50,
                                position_y: 50
                            }
                        },
                }
            },
            /**
             * Системные параметры
             * */
            system: {
                name: 'system',
                schema: {
                    /**
                     * uuid статьи
                     * */
                    _id: {
                        type: String,
                        required: true
                    },
                    /**
                     * Рекламный блок
                     * */
                    ads: {
                        /**
                         * Флаг отображения рекламы
                         * */
                        isShowingAds: {
                            type: Boolean,
                            required: true
                        }
                    }
                }
            },
            /**
             * Категории статей
             * */
            themesOfPublication: {
                /**
                 * Наименование
                 * */
                name: 'themesOfPublication',
                /**
                 * Схема тем публикаций
                 * */
                schema: {
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
                 * Заготовка для создания новых объектов
                 * */
                newObject:{
                    /**
                     * uuid темы публикации
                     * */
                    _id: undefined,
                    /**
                     * Значение темы публикации
                     * */
                    value: ''
                }
            }
            },
            /**
             * Категории пользователей
             * */
            roleOfUser: {
                /**
                 * Наименование
                 * */
                name: 'roleOfUser',
                /**
                 * Схема роли пользователя.
                 * Роль пользователя представляет права доступа пользователю.
                 * */
                schema: {
                    /**
                     * uuid роли пользователя
                     * */
                    _id: {
                        type: String,
                        required: true
                    },
                    /**
                     * Наименование роли
                     * */
                    name: {
                        type: String,
                        required: true
                    }
                },
            },
            /**
             * Пользователи
             * */
            users: {
                name: 'users',
                /**
                 * Схема пользователя
                 * */

                schema: {
                    /**
                     * uuid пользователя
                     * */
                    _id: {
                        type: String,
                        required: true
                    },
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
                    role: {
                        type: String,
                        ref: 'roleOfUser',
                        required: false
                    }
                }
            }
        },
    },
    /**
     * Модель запросов
     * */
    MODEL_REQUESTS: {
        /**
         * Адрес запроса для авторизации пользователя.
         * */
        auth: '/auth',
        /**
         * Функция формирует адрес запроса к БД.
         * Входные параметры рекомендуется брать из соответствущих разделов api
         * @param collection {String} Наиенование коллекции
         * @param action {String} Выполняемый запрос к БД
         * */
        db: (collection, action) => {
            return `/db/${collection}/${action}`
        },
    },
}