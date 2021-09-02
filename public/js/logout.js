
const logout = async (event) => {
    event.preventDefault();
    console.log('Trying to logout');
    const response = await fetch('api/user/logout', {
        method: "POST",
        headers: {'Content-Type':'application/json'}
    });

    if(response.ok){
        console.log('User logged out');
        document.location.replace('/');
    } else {
        console.log('User failed to logout');
        alert(response.statusText);
    }
}

document.querySelector('#logout').addEventListener('click', logout);