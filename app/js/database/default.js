const hash = require('jshashes')

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
            pass: new hash.SHA1().b64('not admin'),
            role: '123'
        }
    ]

}