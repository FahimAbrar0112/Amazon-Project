import {
    cart,
    removeFromCart,
    updateQuantity,
    updateDeliveryOption
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

import { deliveryOptions } from "../data/deliveryOptions.js"




// Importing external libraries from internet :
// import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js"
// hello();



// dayjs library : use chatgpt => "dayjs documentation" for more information


//  renderOrderSummar() =>  helps to render the whole website without reloading . It updates whenever we change or select in the Choose delivery option.
// renderOrderSummary() => idea came wehn I tried to make the page reload or respond whenever some changes were made in the Choose delivery option.
function renderOrderSummary() {

    const today = dayjs();
    const deliveryDate = today.add(7, 'days');
    console.log(deliveryDate);
    deliveryDate.format('dddd , MMMM D');

    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        let matchingProduct;
        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        // console.log(matchingProduct);

        const deliveryOptionId = cartItem.deliveryOptionId;

        let deliveryOption;

        deliveryOptions.forEach((option) => {
            if (option.id == deliveryOptionId) {
                deliveryOption = option;
            }

        });

        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            'days'
        );

        const dateString = deliveryDate.format('dddd, MMMM D');
        // this dateString will be used in "<div class="delivery-date">Delivery date: ${dateString}</div>" to update the Delivey Date

        cartSummaryHTML += `
        
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id
            }">
                <div class="delivery-date js-to-update-delivery-date">Delivery date: ${dateString}</div>

                <div class="cart-item-details-grid">
                <img
                    class="product-image"
                    src="${matchingProduct.image}"
                />

                <div class="cart-item-details">
                    <div class="product-name">
                    ${matchingProduct.name}
                    </div>
                    <div class="product-price">$${formatCurrency(
                matchingProduct.priceCents
            )}</div>
                    <div class="product-quantity">
                    <span>Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                    
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                    </span>

                    <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link"
              data-product-id="${matchingProduct.id}">
              Save
            </span>

                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id
            }">
                        Delete
                    </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>

                     ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
                </div>
            </div>
        
        
        
        
        `;
    });
    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

    function checkoutItemsCount() {
        let totalItems = 0;
        cart.forEach((cartItem) => {
            totalItems += cartItem.quantity;
        });

        document.querySelector(".js-checkout-items-count").textContent = `${totalItems} items`;

    }

    checkoutItemsCount();

    // console.log(cartSummaryHTML);

    document.querySelectorAll(".js-delete-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            // console.log(cart);

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );

            container.remove();
            checkoutItemsCount();

            console.log(container);
        });
    });

    // CLear Cart Button Functionality:
    document.querySelector(".js-clear-cart").addEventListener("click", () => {
        cart.forEach((cartItem) => {
            const productId = cartItem.productId;
            removeFromCart(productId);

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );

            container.remove();

            console.log(container);
        });


        document.querySelector(".js-checkout-items-count").textContent = "0 items";

        // cart.length = 0;
        console.log(cart);
    });


    // Update Cart Button Functionality :

    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                // console.log(productId);
                const container = document.querySelector(`.js-cart-item-container-${productId}`
                );
                container.classList.add('is-editing-quantity');
            });
        });



    document.querySelectorAll('.js-save-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;

                // Here's an example of a feature we can add: validation.
                // Note: we need to move the quantity-related code up
                // because if the new quantity is not valid, we should
                // return early and NOT run the rest of the code. This
                // technique is called an "early return".
                const quantityInput = document.querySelector(
                    `.js-quantity-input-${productId}`
                );
                const newQuantity = Number(quantityInput.value);

                if (newQuantity < 0 || newQuantity >= 1000) {
                    alert('Quantity must be at least 0 and less than 1000');
                    return;
                }

                updateQuantity(productId, newQuantity);

                const container = document.querySelector(
                    `.js-cart-item-container-${productId}`
                );
                container.classList.remove('is-editing-quantity');

                const quantityLabel = document.querySelector(
                    `.js-quantity-label-${productId}`
                );
                quantityLabel.innerHTML = newQuantity;

                checkoutItemsCount();
            });
        });

    // Delivery Options inside cart : 

    function deliveryOptionsHTML(matchingProduct, cartItem) {

        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays,
                'days'
            );

            const dateString = deliveryDate.format('dddd, MMMM D');


            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;


            const isChecked = (deliveryOption.id == cartItem.deliveryOptionId);


            html += `
        
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
            <input
                type="radio"
                ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}"
            />
            <div>
                <div class="delivery-option-date">${dateString}</div>
                <div class="delivery-option-price">${priceString} Shipping</div>
            </div>
        </div>
        
        `


        });

        return html;
    }


    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {

            element.addEventListener('click', () => {
                const { productId, deliveryOptionId } = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                // location.reload();

                renderOrderSummary();

            });

        });
}


renderOrderSummary();