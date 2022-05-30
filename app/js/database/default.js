module.exports = {
    system: {
        ads: {
            isShowingAds: false,
        },
    },
    roleOfUser: [
        {
            name: 'guest',
            accessRights: {}
        },
        {
            name: 'user',
            accessRights: {}
        },
        {
            name: 'admin',
            accessRights: {}
        },
    ],
    users: [
        {
            name: "admin",
            pass: 'not admin',
            role_id: '123'
        }
    ]

}