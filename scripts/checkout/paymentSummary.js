import {
  cart,
  removeFromCart,
  checkoutItemsCount
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js"
import { renderOrderSummary } from "./orderSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";



export function renderPaymentSummary() {

  let productPriceCents = 0;
  let shippingPriceCents = 0;


  cart.forEach((cartItem) => {

    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;

  const taxCents = totalBeforeTaxCents * 0.1; // => 10% tax = 10/100

  const totalCents = totalBeforeTaxCents + taxCents;


  // cart Quantity updating: 
  const cartQuantity = checkoutItemsCount();

  //

  const paymentSummaryHTML = `

    <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>

          <button class="clear-cart-button js-clear-cart">Clear Cart</button>
    
    `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;







  ////////////////////////////////////////////////
  // CLear Cart Button Functionality:
  document.querySelector(".js-clear-cart").addEventListener("click", () => {
    cart.forEach((cartItem) => {
      const productId = cartItem.productId;
      removeFromCart(productId);



      // console.log(container);
    });



    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();

    // cart.length = 0;
    // console.log(cart);
  });
}

