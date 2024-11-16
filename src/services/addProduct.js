export async function addProduct(data, token){
    try {
        const product = await fetch("http://localhost:5000/api/product/create", {
            method: "POST",
            headers: {
                // "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return product;

    } catch (error) {
        console.log(error);
    }
}