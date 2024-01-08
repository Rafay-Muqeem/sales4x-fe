export async function addProduct(data){
    try {
        const product = await fetch("https://solutions4x.com/api/product/create", {
            method: "POST",
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