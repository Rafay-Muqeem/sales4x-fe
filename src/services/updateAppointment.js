export async function updateAppointment(id, data, token){
    try {
        const appointment = await fetch(`http://localhost:5000/api/appointment/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return appointment;

    } catch (error) {
        console.log(error);
    }
}