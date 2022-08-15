const schemas = {
    publication: {
        /**
         * uuid публикаци
         * */
        _id: {
            type: String,
            required: true
        },
        author: {
            type: String,
            ref: 'users',
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
        theme: {
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
                required: true,
                unique: true
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
    list: {
        _id: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true,
            unique: true
        },
    }
}

const accessRights = {
    ReadOnly: 'Read Only',
    ReadWrite: 'Read/Write',
    NotAllow: 'Not allow',
}

const collectionsName = {
    /**
     * Коллекция прав доступа
     * */
    accessRights: 'accessRights',
    /**
     * Коллекция групп пользователей
     * */
    groups: 'groups',
    /**
     * Коллекция пользователей
     * */
    users: 'users',

    /**
     * Коллекция черновиков публикаций
     * */
    drafts: 'drafts',
    /**
     * Коллекция публикаций
     * */
    publications: 'publications',
    /**
     * Коллекция категорий статей
     * */
    themesOfPublication: 'themesOfPublication',

    /**
     * Коллекция системных параметров
     * */
    system: 'system',
}

module.exports = {
    /**
     * Основные действия с БД
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
     * Права доступа к контенту
     * */
    ACCESS_RIGHTS: accessRights,
    /**
     * Заготовки тел заросов
     * */
    BODY_REQUEST: {
        termsSampling: {
            shift: 0,
            count: 0
        }
    },
    /**
     * Тело ответа
     * */
    BODY_RESPONSE: {
        /**
         * Код ответа
         * */
        responseCode: -1,
        /**
         * Сообщение
         * */
        message: '',
        /**
         * Передаваемые данные
         * */
        datas: {
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
     * Коды ответов
     * */
    CODES_RESPONSE: {
        ok: {
            responseCode: 200,
            message: "Хорошо"
        },
        created: {
            responseCode: 201,
            message: "Создано"
        },
        updated: {
            responseCode: 202,
            message: "Обновлено"
        },
        removed: {
            responseCode: 203,
            message: "Удалено"
        },
        noContent: {
            responseCode: 204,
            message: "Нет контента"
        },
        alreadyReported: {
            responseCode: 208,
            message: "Уже сообщалось"
        },
        badRequest: {
            responseCode: 400,
            message: "Некорректный запрос"
        },
        unauthorized: {
            responseCode: 401,
            message: "Не авторизован"
        },
        notFound: {
            responseCode: 404,
            message: "Не найдено"
        },
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
             * Права доступа
             * */
            accessRights: {
                name: collectionsName.accessRights,
                /**
                 * Схема пользователя
                 * */
                schema: schemas.list
            },
            /**
             * Группы пользователей
             * */
            groups: {
                /**
                 * Наименование
                 * */
                name: collectionsName.groups,
                /**
                 * Схема групп пользователей.
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
                     * Наименование группы
                     * */
                    name: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    /**
                     * Описание группы
                     * */
                    description: {
                        type: String,
                        required: false,
                    },
                    rights: {
                        publications: {
                            type: String,
                            ref: collectionsName.accessRights,
                            required: true
                        },
                        system: {
                            type: String,
                            ref: collectionsName.accessRights,
                            required: true
                        },
                        themesOfPublication: {
                            type: String,
                            ref: collectionsName.accessRights,
                            required: true
                        },
                        groups: {
                            type: String,
                            ref: collectionsName.accessRights,
                            required: true
                        },
                        users: {
                            type: String,
                            ref: collectionsName.accessRights,
                            required: true
                        },
                        accessRights: {
                            type: String,
                            ref: collectionsName.accessRights,
                            required: true
                        }
                    }
                },
            },
            /**
             * Пользователи
             * */
            users: {
                name: collectionsName.users,
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
                    /**
                     * Поля для авторизации и аутентификации
                     * */
                    auth: {
                        name: {
                            type: String,
                            required: true,
                            unique: true
                        },
                        pass: {
                            type: String,
                            required: true
                        },
                    },
                    /**
                     * Персональные данные
                     * */
                    personal: {
                        nickname: {
                            type: String,
                        }
                    },
                    /**
                     * Идентификатор роли пользователя
                     * */
                    group: {
                        type: String,
                        ref: collectionsName.groups,
                        required: true,
                    }
                }
            },

            /**
             * Черновики публикаций
             * */
            drafts: {
                /**
                 * Наименование
                 * */
                name: collectionsName.drafts,
                /**
                 * Схема черновика в БД
                 * */
                schema: schemas.publication,
            },
            /**
             * Публикации
             * */
            publications: {
                /**
                 * Наименование
                 * */
                name: collectionsName.publications,
                /**
                 * Схема публикации в БД
                 * */
                schema: schemas.publication,
            },

            /**
             * Категории статей
             * */
            themesOfPublication: {
                /**
                 * Наименование
                 * */
                name: collectionsName.themesOfPublication,
                /**
                 * Схема тем публикаций
                 * */
                schema: schemas.list,
            },

            /**
             * Системные параметры
             * */
            system: {
                name: collectionsName.system,
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
        },
    },

    /**
     * Сущности с которыми проводятся взаимодействия
     * */
    ESSENCE: {
        user: {
            name: 'user',
            actions: {
                auth: 'auth',
                addNew: 'add_new',
                edit: 'edit',

            }
        },
        group: {
            name: 'group',
            actions: {
                addNew: 'add_new',
                edit: 'edit',
            }
        },
        publication: {
            name: 'publication',
            actions: {
                findSampleByAuthor: 'findSampleByAuthor',
                findByTitle: 'findByTitle',
                findSample: 'findSample',
                saveDraft: 'saveDraft',
                publish: 'publish',
                edit: 'edit',
                remove: 'remove',
                addTheme: 'addTheme',
                getThemes: 'getThemes',
                editTheme: 'editTheme',
                removeTheme: 'removeTheme',
            }
        },
        system: {
            name: 'system',
            actions: {
                edit: 'edit'
            }
        },
    },

    NEW_OBJECTS: {
        /**
         * Заготовка для создания нового объекта группы пользователей
         * */
        group: {
            _id: undefined,
            name: 'New group',
            description: '',
            rights: {
                publications: {value: accessRights.NotAllow},
                system: {value: accessRights.NotAllow},
                themesOfPublication: {value: accessRights.NotAllow},
                groups: {value: accessRights.NotAllow},
                users: {value: accessRights.NotAllow},
                accessRights: {value: accessRights.NotAllow},
            }
        },
        /**
         * Заготовка для создания новых объектов публикаций
         * */
        publication: {
            _id: undefined,
            author: undefined,
            dateStamp: new Date(),
            theme: {
                _id: '-1'
            },
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
         * Заготовка для создания нового объекта пользователя
         * */
        user: {
            auth: {
                name: '',
                pass: ''
            },
            personal: {
                nickname: ''
            },
            group: ''
        }
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
        /**
         * Функция формирует адрес запроса к серверу для работы с сущностью.
         * Входные параметры рекомендуется брать из соответствущих разделов api
         * @param essence {String} Наиенование коллекции
         * @param action {String} Выполняемый запрос к БД
         * */
        work_e: (essence, action) => {
            return `/work/${essence}/${action}`
        },
    },
}