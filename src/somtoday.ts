import axios from "axios";
import { JsonToUrl } from "./utility";

//TODO: make these classes for cleaner code
interface Token {
    access_token: string,
    refresh_token: string,
    api_url: string,
    expires_in: number
}
interface Lesson { 
    location: string,
    title: string,
    start_date: Date,
    end_date: Date,
    start_hour: number,
    end_hour: number
}

//get access token
export async function Authenticate(schoolUUID:string, username:string, password:string):Promise<Token> {

    const body = {
        grant_type: 'password',
        username: `${schoolUUID}\\${username}`,
        password: password,
        scope: 'openid',
        client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2'
    };

    const formBody = JsonToUrl(body);

    const response = await axios.post('https://somtoday.nl/oauth2/token', formBody, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })

    if (response.status == 400) {
        throw new Error("Somtoday returned 'Bad Request'");
    }

    //remove unneeded information
    const data = response.data
    const result:Token = { 
        access_token:data.access_token, 
        refresh_token: data.refresh_token, 
        api_url: data.somtoday_api_url,
        expires_in: data.expires_in 
    }

    return result;
}

//refresh access token
export async function RefreshToken(refresh_token:string):Promise<Token> {

    const body = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2'
    };
    
    const formBody = JsonToUrl(body);

    const response = await axios.post('https://somtoday.nl/oauth2/token', formBody, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    
    //remove unneeded information
    const data = response.data
    const result:Token = { 
        access_token:data.access_token, 
        refresh_token: data.refresh_token, 
        api_url: data.somtoday_api_url,
        expires_in: data.expires_in 
    }

    return result;
}

//get schedule
export async function GetSchedule(access_token:string, start_date:Date, end_date:Date, api_url:string):Promise<Lesson[]> {
    
    const body = {
        sort: 'sort=asc-id',
        //javascript months go from 0-11, so add a month
        begindatum: `begindatum=${start_date.getFullYear()}-${start_date.getMonth() + 1}-${start_date.getDate()}`,
        einddatum: `einddatum=${end_date.getFullYear()}-${end_date.getMonth() + 1}-${end_date.getDate()}`
    };

    const response = await axios.get(`${api_url}/rest/v1/afspraken?${body.sort}&${body.begindatum}&${body.einddatum}`,{
        headers: { Authorization: `Bearer ${access_token}`, 'Accept': "application/json" }
    });
    
    //remove unneeded information
    const array = response.data.items
    const result:Lesson[] = []
    array.forEach((element: { locatie: any; beginDatumTijd: any; eindDatumTijd: any; beginLesuur: any; eindLesuur: any; titel: any; }) => {
        result.push({
            location: element.locatie,
            start_date: element.beginDatumTijd,
            end_date: element.eindDatumTijd,
            start_hour: element.beginLesuur,
            end_hour: element.eindLesuur,
            title: element.titel
        })
    });

    return result;
}
