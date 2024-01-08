export async function fetchProducts(){
    try {
        const products = await fetch("https://solutions4x.com/api/product/", {
            method: "GET",
        })
       
        return products;

    } catch (error) {
        console.log(error);
    }users
}