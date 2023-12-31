export async function delUser(id){
    try {
        const user = await fetch(`http://localhost:5000/api/user/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return user.json();

    } catch (error) {
        console.log(error);
    }
}