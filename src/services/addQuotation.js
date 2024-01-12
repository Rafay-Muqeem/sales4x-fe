export async function addQuotaion(data){
    try {
        const quotation = await fetch("http://localhost:5000/api/quotation/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return quotation;

    } catch (error) {
        console.log(error);
    }
}