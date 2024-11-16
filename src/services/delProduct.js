export async function delProduct(id, token){
    try {
        const product = await fetch(`http://localhost:5000/api/product/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        })
       
        return product;

    } catch (error) {
        console.log(error);
    }
}