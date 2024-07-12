import { addToCart,cart } from '../../data/cart.js';

describe('test suite : addToCart', () => {

    spyOn(loca1Storage, 'getltem').and.callFake(() =>{
        return JSON.stringify([]);

    });
    console.log(loca1Storage.getItem('cart'));

    it('adds an existing product to the cart', () => {

    });

    it('adds a new product to the cart', () => {
        addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6')
        expect(cart.length).toEqual(1);


    });

});