const axios = require('axios');
const http = require('http');
const app = require('../../app.js');

let server;
let client;
jest.setTimeout(30000);
describe('Calc Operations', () =>{
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);

        client = axios.create({
            baseURL: `http://localhost:${server.address().port}`,
            timeout: 100000,
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus() {
                return true;
              },
        });
    });

    afterAll(async (done) => {
        process.emit('closeTimers');
        process.emit('exit');
        server.close(done);
    });

    it('registers user, sends calc, check logs', async() => {
        const registerRes = await client.post('/register', {
            user: 'subharthi'
        });

        expect(registerRes.data).toHaveProperty('token');

        const calcRes = await client.post('/calc', {
            expression: '2+2*2'
        }, {
            headers: {
                Authorization: `Bearer ${registerRes.data.token}`
            }
        });
        
        expect(calcRes.data.data.result).toBe(6)

        const logsRes = await client.get('/logs', {
            headers: {
                Authorization: `Bearer ${registerRes.data.token}`
            }
        });

        const [log] = logsRes.data.data;
        expect(log.user).toBe('subharthi');
        expect(log.expression).toBe('2+2*2');
        expect(log.result).toBe(6);
        expect(log).toHaveProperty('id')
    });

    it('registers user, sends multi calcs, check 10 logs ', async() => {
        const registerRes = await client.post('/register', {
            user: 'sub'
        });

        const calcRes = []
        for(i=0; i<5; i++){
            calcRes[i] = await client.post('/calc', {
                expression: '2+2*2'
            }, {
                headers: {
                    Authorization: `Bearer ${registerRes.data.token}`
                }
            });
        }

        const logsRes = await client.get('/logs', {
            headers: {
                Authorization: `Bearer ${registerRes.data.token}`
            }
        });
        
        expect(logsRes.data.data.length < 11).toBe(true)
    });

    it('without authorization, calc and logs should throw unauthorized exception', async() => {
        
        const calcRes =  await client.post('/calc', {
            expression: '2+2*2'
        });
        expect(calcRes.data.errors.error.status).toBe(401)
        expect(calcRes.data.errors.error.name).toBe('UnauthorizedError')
        expect(calcRes.data.errors.error.message).toBe('Bearer Token required!')

        const logsRes = await client.get('/logs');
        expect(logsRes.data.errors.error.status).toBe(401)
        expect(logsRes.data.errors.error.name).toBe('UnauthorizedError')
        expect(logsRes.data.errors.error.message).toBe('Bearer Token required!')
    });

})
