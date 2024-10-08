const DOMAIN = "contaprof.abgl.live"

function onload() {
    
    if (window.localStorage.getItem('username')) {
        document.getElementById('username').value = window.localStorage.getItem('username')
    }

    login()

}


function login() {

    const newUsername = document.getElementById('username').value;
    if (newUsername == "") {
        return;
    }

    window.localStorage.setItem('username', newUsername)
    document.getElementById('displayusername').innerText = newUsername

    const rawcounterslist = document.getElementById('rawcounterslist')

    fetch(`https://${DOMAIN}/api/counters/${newUsername}`)
        .then(async (response) => {
            rawcounterslist.innerText = await response.text();
            loadwords(rawcounterslist.innerText);
        });
    
    
        
}

function loadwords(rawlist) {

    const rawwordslist = document.getElementById('rawwordslist');
    console.log(rawlist);

    const counters = JSON.parse(rawlist);
    rawwordslist.innerText = "";

    for (const counter of counters) {
        console.log('meow' + JSON.stringify(counter));

        fetch(`https://${DOMAIN}/api/words/${counter.id}`)
            .then(async (response) => {
                const text = await response.text();
                rawwordslist.innerText += `${counter.word}: ${text}\n`; 
            })
            .catch(err => console.error('Error fetching words:', err));
    }
}


function sendword() {

    word = document.getElementById('in_word').value
    profname = document.getElementById('in_profname').value

    fetch(`https://${DOMAIN}/api/addword/`, {
        method: "POST",
        body: JSON.stringify({
          owner: window.localStorage.getItem('username'),
          profname: profname,
          word: word
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    }
        ).then(async (response) => {
            document.getElementById('out_wordsend').innerText = response.status
        }
    );
      
    login()

}