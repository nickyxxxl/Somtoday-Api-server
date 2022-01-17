export function JsonToUrl(object:object) {
    var formBody:string[] = []

    Object.entries(object).forEach(([key, value]) => {
        formBody.push( encodeURIComponent(key) + "=" + encodeURIComponent(value) );
    })

    const result = formBody.join('&')
    return result
}

//shamefully stolen from stackoverflow
export function getMonday(d:Date):Date {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(new Date(d.setDate(diff)).setHours(0));
} 

export function addDays(d:Date, add:number):Date {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() + add;
    return new Date(d.setDate(diff));
}