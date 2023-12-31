export async function updateUser(id, data){
    try {
        const user = await fetch(`http://localhost:5000/api/user/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return user;

    } catch (error) {
        console.log(error);
    }
}