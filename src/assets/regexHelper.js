const regex = {
    name : (str) => {
        const nameRe = /^[A-Za-z]+([\ A-Za-z]+)*/
        return (nameRe.test(String(str)))
    },
    email : (str) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return (re.test(String(str).toLowerCase()))
    },
    password : (str) => {
        const passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
        return (passRe.test(String(str)))
    }
}

module.exports = regex;