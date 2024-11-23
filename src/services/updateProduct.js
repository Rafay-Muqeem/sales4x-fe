export async function updateProduct(id, data, token){
    try {
        const product = await fetch(`http://localhost:5000/api/product/update/${id}`, {
            method: "PUT",
            headers: {
                // "Content-Type": "application/json",
                "auth-token": token
            },
            body: data
        })
       
        return product;

    } catch (error) {
        console.log(error);
    }
}