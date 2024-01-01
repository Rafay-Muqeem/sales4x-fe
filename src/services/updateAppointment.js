export async function updateAppointment(id, data){
    try {
        const appointment = await fetch(`https://solutions4x.com/api/appointment/update/${id}`, {
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