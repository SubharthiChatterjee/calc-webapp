const { test, expect } = require('@jest/globals');
const {calculate} = require('./calc');

test('validate incorrect expression', async () => {
    try{
        const result = calculate('2//1')
    
    }catch (e){
        console.log('hello')
        expect(e.message).toBe('expression 2//1 is invalid');
    }
});

test('calculate', async () => {
    const result = calculate('2/1-1')
    expect(result).toBe(1)
});