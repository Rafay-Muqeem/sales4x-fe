export async function fetchProducts(token){
    try {
        const products = await fetch("http://localhost:5000/api/product/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return products;

    } catch (error) {
        console.log(error);
    }users
}