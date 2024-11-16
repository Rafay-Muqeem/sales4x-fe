export async function delUser(id, token){
    try {
        const user = await fetch(`http://localhost:5000/api/user/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        })
       
        return user;

    } catch (error) {
        console.log(error);
    }
}