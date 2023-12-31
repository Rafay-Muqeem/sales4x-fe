export async function delProduct(id){
    try {
        const product = await fetch(`http://localhost:5000/api/product/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return product.json();

    } catch (error) {
        console.log(error);
    }
}