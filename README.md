# somtoday-api-server
Nodejs server to proxy Somtoday requests.
(note: this project is just for practice & fun, not to be taken seriously)

### Goals
 - Simplify the Somtoday API
 - Not having annoying CORS headers
 - Add new useful features
 
### Building
#### Dependencies
You need to have nodejs > 17 and yarn installed

#### Running
Clone the repository:
`git clone https://github.com/nickyxxxl/somtoday-api-server && cd somtoday-api-server`

Install dependencies:
`yarn install`

Run the server:
`yarn start`

#### Docker image
A docker image is also available:
`yarn run docker`

## Currently implemented

### Authentication
#### \[server url]/auth
#### \[server url]/refresh

### Schedule
#### \[server url]/schedule

### Icalendar
#### \[server url]/ical
  Retrieve the schedule of this week in Icalendar format.
  Special thanks to Tijn for coming up with this idea

**Request**: 
`{ access_token: <access_token>, api_url: <api_url> }`

**Returns**:
Icalendar data in plain text
