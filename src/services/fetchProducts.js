export async function fetchProducts(){
    try {
        const products = await fetch("http://localhost:5000/api/product/", {
            method: "GET",
        })
       
        return products;

    } catch (error) {
        console.log(error);
    }
}