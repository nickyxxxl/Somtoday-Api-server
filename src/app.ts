import express, { Application, Request, Response } from "express"
import somtoday from "somtoday.js"; //alleen nodig voor searchOrganisation, kan herschreven worden om deze dependency weg te halen
import { Authenticate, RefreshToken, GetSchedule } from "./somtoday"

//express init
const app: Application = express()
const port = 3000
app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://nickyxxxl.nl')
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Content-Type, Accept')
    console.log('request received:', req.body);
    
    next()
})

//login
interface AuthBody {
    schoolUUID: string,
    username: string,
    password: string
}
interface Token {
    access_token: string,
    refresh_token: string,
    api_url: string,
    expires_in: number
}
app.post('/auth', async (req, res) => {
    const request: AuthBody = req.body
    //if bad request
    if (request.schoolUUID == undefined || request.username == undefined || request.password == undefined) {
        res.sendStatus(400)
        return
    }
    const token:Token = await Authenticate(request.schoolUUID, request.username, request.password)
    res.json(token)
})

//refresh token
interface RefreshQuery {
    refresh_token:string
}
app.post('/refresh', async (req, res) => {
    const request:RefreshQuery = req.body
    const new_token = await RefreshToken(request.refresh_token)
    res.json(new_token)
})

//schedule query
interface ScheduleQuery {
    access_token: string,
    api_url: string,
    start_date: Date,
    end_date?: Date
}
app.post('/schedule', async (req, res) => {
    const request:ScheduleQuery = req.body
    if (request.access_token == null) {
        res.json('Invalid access token')
        return
    }

    let daystart:Date
    let dayend:Date
    //if end_date is not provided, return schedule for today
    if (typeof request.end_date === 'undefined') {
        const timenow:number = Date.now()
        daystart = new Date(timenow)
        dayend = new Date(daystart.getFullYear(), daystart.getMonth(), daystart.getDate() + 2)
    } else {
        daystart = request.start_date
        dayend = request.end_date
    }

    const schedule = await GetSchedule(request.access_token, daystart, dayend, request.api_url)

    res.json(schedule);
});


//schools
app.get('/schools', async (req: Request, res: Response) => {
    res.send(await somtoday.getOrganizations())
})
app.get('/schools/:school', async (req, res) => {
    res.send(await somtoday.searchOrganisation({name:req.params.school}))
})

//health check
app.get('/', (req, res) => {
    res.send('OK')
})
app.post('/', (req, res) => {
    res.send('OK')
})

//start server
app.listen(port, () => console.log(`Api listening on port ${port}!`))
