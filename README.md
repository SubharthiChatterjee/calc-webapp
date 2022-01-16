<div align="center">
  <h1>Calculator App</h1>
  <p>Calculator Application</p>
</div>

## calc-webapp
Calculator Web Application

## Getting started
Run the following commands to download and install this starter:

```bash
git clone https://github.com/SubharthiChatterjee/calc-webapp.git
cd calc-webapp
npm install
```
## Environment setup
Create a .env file and paste the following
```bash
NODE_ENV=local
ACCESS_KEY_ID=<aws access key>
SECRET_ACCESS_KEY=<aws access secret>
BUCKET_NAME=<aws s3 bucket>
APP_SECRET=<app secret key (128 bit random string hex)>
```

## Run Api Server in local
Run `npm run server` by default port is 3000

## Deploy Api Server in dev/production
1. Install serverless (https://www.serverless.com/)
2. Export `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY` to local env
3. Database used here is AWS s3. Login to AWS Console and goto s3 create a bucket. 
From under `config` folder upload file `callogs.json` into s3 bucket.
Provide the bucket name in .env file `BUCKET_NAME` and replace bucket name with `<your-bucket-name>` in file `config.yml`
4. To deploy the api use the following
```bash
sls package
sls deploy
```
5. Once deployment is done. Use the Api Gateway base path (for eg: https://XXXXXX.execute-api.us-east-1.amazonaws.com/dev)


## Api Details
```
Description: Register an user

Method: POST 

Uri: /register

Request Header:
    "content-type": "application/json"

Request Body:
    {
        "user": "abc"
    }

Response:
    {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoieHJ0In0.auNsJ4PNUpWUAiatIG-hI0kEZBllEkTF_7dpGTN_crQ",           
    }
```
```
Description: Calculate expression

Method: POST 

Uri: /calc

Request Header:
    "content-type": "application/json"
    "Authorization": "Bearer <token>"

Request Body:
    {
        "expression": "3*4+2"
    }

Response:
    {
        "data": [
            {
                "result": 14
            }
        ]
    }
```

```
Description: Get latest calculation logs
Method: GET 

Uri: /logs

Request Header:
    "content-type": "application/json"
    "Authorization": "Bearer <token>"

Response:
    {
        "data": [
            {
                "user": "xrt",
                "expression": "3*4/2-1+3",
                "result": 8,
                "id": "76ed4288-2ef2-4e0b-9a89-bcc1a55d4335"
            },
            {
                "user": "b",
                "expression": "5*6*6*1",
                "result": 180,
                "id": "5bbf4b05-12a9-44e0-bae0-019212939f91"
            }
        ]
    }
```

## Test for Application
Run `npm run test`
For code coverage `npm run test-coverage`
