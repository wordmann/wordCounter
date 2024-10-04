
function login() {

    const newUsername = document.getElementById('username').value;
    if (newUsername == "") {
        return;
    }

    const rawlist = document.getElementById('rawlist')

    fetch(`https://localhost:3001/api/user/${newUsername}`)
        .then((response) => response.json())
        .then((json) => rawlist.innerText = json);
    
    
}