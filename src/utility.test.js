const utility = require('./utility.ts')
const JsonToUrl = utility.JsonToUrl

const formBody = {
    grant_type: 'password',
    username: `b6256752-bbcf-42e0-8c7c-9e4643f0e827\\4403`,
    password: 'A1b2c3d4!',
    scope: 'openid',
    client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2'
}

test('converts json to urlencoded', () => {
     expect(JsonToUrl(formBody)).toBe(
        "grant_type=password&username=b6256752-bbcf-42e0-8c7c-9e4643f0e827%5C4403&password=A1b2c3d4!&scope=openid&client_id=D50E0C06-32D1-4B41-A137-A9A850C892C2"
     )
})