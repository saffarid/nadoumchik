module.exports = {
    system: {
        ads: {
            isShowingAds: false,
        },
    },
    roleOfUser: {
        guest: {
            accessRights: {}
        },
        user: {
            accessRights: {}
        },
        admin: {
            accessRights: {}
        },
    },
    users: [
        {
            name: "admin",
            pass: 'not admin',
            role: 'admin'
        }
    ]

}