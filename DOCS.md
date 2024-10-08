
## /api/addword
### Reqeust
- owner: String, id of user who is adding the word
- profname: String, name of the person who said the word (has to be precise)
- word: String, the word being said (has to be precise)
### Response
{"idcounter":1}

## /api/counters/{user_id: String}
### Request
na
### Response
list of counters 
example 
```json
[
    {
        "id":1,
        "word":"cellulare",
        "owner":"wordrc"
    }
]
```
