export async function delAppointment(id){
    try {
        const appointment = await fetch(`http://localhost:5000/api/appointment/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return appointment.json();

    } catch (error) {
        console.log(error);
    }
}