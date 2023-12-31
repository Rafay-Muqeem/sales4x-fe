export async function updateAppointment(id, data){
    try {
        const appointment = await fetch(`http://localhost:5000/api/appointment/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return appointment;

    } catch (error) {
        console.log(error);
    }
}