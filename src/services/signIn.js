export async function signIn(data){
    try {
        const user = await fetch("https://solutions4x.com/api/user/login", {
            method: "POST",
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