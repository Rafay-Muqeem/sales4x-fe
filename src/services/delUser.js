export async function delUser(id){
    try {
        const user = await fetch(`https://solutions4x.com/api/user/delete/${id}`, {
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