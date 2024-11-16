export async function addAppointment(data, token){
    try {
        const tax = await fetch("http://localhost:5000/api/appointment/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return tax;

    } catch (error) {
        console.log(error);
    }
}