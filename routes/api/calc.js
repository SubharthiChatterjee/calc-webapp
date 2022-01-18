const router = require('express').Router();
const UnauthorizedError = require('../../errors/UnauthorizedError');
const { calculate } = require('../../service/calc');
const s3 = require('../../service/s3');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jwt-simple');
let calLogs = []

router.post('/calc', async (req, res, next) => {
    try {
        const result = calculate(req.body.expression)
        const user = await getUser(req.headers.authorization)

        if (process.env.NODE_ENV !== 'local' && calLogs.length == 0)
            calLogs = await s3.getData();

        calLogs = [{
            user: user,
            expression: req.body.expression,
            result,
            id: uuidv4()
        }, ...calLogs.slice(0, 9)]

        if (process.env.NODE_ENV !== 'local')
            await s3.uploadData(calLogs);

        return res.json({
            data: {
                result
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/logs', async (req, res, next) => {
    try {
        const user = await getUser(req.headers.authorization)

        if (process.env.NODE_ENV !== 'local' && calLogs.length == 0)
            calLogs = await s3.getData();

        return res.json({
            data: calLogs
        });
    } catch (err) {
        next(err);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const oneDayToSeconds = 24 * 60 * 60;
        const payload = req.body

        token = jwt.encode(payload, process.env.APP_SECRET);
        return res.json({
            token
        });
    } catch (err) {
        next(err);
    }
});

const getUser = async (authorization) => {
    if (!authorization || !authorization.includes('Bearer'))
        throw new UnauthorizedError('token_required', {
            message: 'Bearer Token required!'
        })
    const token = authorization.split(' ')[1];
    try{
        const payload = jwt.decode(token, process.env.APP_SECRET);
        return payload.user;
    }catch(e){
        throw new UnauthorizedError('token_invalid', {
            message: 'Bearer token invalid!'
        })
    }
}

module.exports = router;
