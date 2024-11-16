export async function addAddress(data, token){
    try {
        const res = await fetch("http://localhost:5000/api/address/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return res;

    } catch (error) {
        console.log(error);
    }
}