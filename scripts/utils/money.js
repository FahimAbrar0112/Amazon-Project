

export function formatCurrency(priceCetns) {
    return ( Math.round(priceCetns) / 100).toFixed(2);
}


export default formatCurrency;