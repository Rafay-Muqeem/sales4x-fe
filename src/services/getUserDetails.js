export async function getUserDetails(token){
    try {
        const userInfo = await fetch("http://localhost:5000/api/user/getuser", {
            method: "POST",
            headers: {
                "auth-token": token
            }
        })
        
        return userInfo;

    } catch (error) {
        return error;
    }
}