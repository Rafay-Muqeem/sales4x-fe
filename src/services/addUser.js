export async function addUser(data, token){
    try {
        const user = await fetch("http://localhost:5000/api/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return user;

    } catch (error) {
        console.log(error);
    }
}