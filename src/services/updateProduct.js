export async function updateProduct(id, data){
    try {
        console.log(data);
        const product = await fetch(`http://localhost:5000/api/product/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return product;

    } catch (error) {
        console.log(error);
    }
}