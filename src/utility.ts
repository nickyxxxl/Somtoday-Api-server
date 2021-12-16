export function JsonToUrl(object:object) {
    var formBody:string[] = []

    Object.entries(object).forEach(([key, value]) => {
        formBody.push( encodeURIComponent(key) + "=" + encodeURIComponent(value) );
    })

    const result = formBody.join('&')
    return result
}
