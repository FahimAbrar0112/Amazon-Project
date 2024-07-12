// export let cart = [
//     {
//         productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
//         quantity: 2,
//         deliveryOptionId: '1'
//     },
//     {
//         productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
//         quantity: 1,
//         deliveryOptionId: '1'
//     }
// ];

// console.log(cart);

// Use that to clear local storage for a particular variable:
// localStorage.removeItem('cart');


class Cart {
    
    cartItems;
    localStorageKey;

    constructor(localStorageKey) {

        this.localStorageKey = localStorageKey;
        this.loadFromStorage();

    }

    loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
    };

    saveToStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));

    };

    addToCart(productId) {
        let matchingItem;

        this.cartItems.forEach((cartItem) => {
            if (productId == cartItem.productId) {
                matchingItem = cartItem;
            }
        });


        //Quantity Selector:

        const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
        const quantity = Number(quantitySelector.value);




        if (matchingItem) {
            matchingItem.quantity += quantity;
        }
        else {
            this.cartItems.push({
                productId: productId,
                quantity: quantity,
                deliveryOptionId: '1'
            });
        }
        this.saveToStorage();
    };

    removeFromCart(productId) {
        const newCart = [];
        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId !== productId) {
                newCart.push(cartItem);
            }
        });

        this.cartItems = newCart;
        this.saveToStorage();

    };

    updateQuantity(productId, newQuantity) {
        let matchingItem;

        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        matchingItem.quantity = newQuantity;

        this.saveToStorage();
    };

    updateDeliveryOption(productId, deliveryOptionId) {

        let matchingItem;

        this.cartItems.forEach((cartItem) => {
            if (productId == cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        matchingItem.deliveryOptionId = deliveryOptionId;

        this.saveToStorage();


    };

    checkoutItemsCount() {
        let totalItems = 0;
        this.cartItems.forEach((cartItem) => {
            totalItems += cartItem.quantity;
        });

        return totalItems;

    };

}



const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');



console.log(cart);
console.log(businessCart);

console.log(cart instanceof Cart);