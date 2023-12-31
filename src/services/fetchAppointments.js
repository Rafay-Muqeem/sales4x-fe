export async function fetchAppointments(){
    try {
        const appointments = await fetch("http://localhost:5000/api/appointment/", {
            method: "GET",
        })
       
        return appointments;

    } catch (error) {
        console.log(error);
    }
}