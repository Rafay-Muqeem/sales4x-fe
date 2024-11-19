export async function delAppointment(id, token){
    try {
        const appointment = await fetch(`http://localhost:5000/api/appointment/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        })
       
        return appointment;

    } catch (error) {
        console.log(error);
    }
}