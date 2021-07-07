    const nameRegex = (str) => {
        const nameRe = /^[A-z]*$|^[A-z]+\s[A-z]*$/;
        return (nameRe.test(String(str)))
    }
    const emailRegex = (str) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return (re.test(String(str).toLowerCase()))
    }
    const passwordRegex = (str) => {
        const passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
        return (passRe.test(String(str)))
    }
    const urlRegex = (str) => {
        const urlRe = /^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g;
        return (urlRe.test(String(str)))
    }


export {nameRegex, emailRegex, passwordRegex, urlRegex}