export async function addAppointment(data){
    try {
        const tax = await fetch("http://localhost:5000/api/appointment/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return tax;

    } catch (error) {
        console.log(error);
    }
}