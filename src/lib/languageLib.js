export default function l(code) {
    let language_code = code.split(".")
    let language_data = VARS.languageData
    console.log(language_data)
    language_code.forEach(item => {
        if (language_data[item]) {
            language_data = language_data[item]
        } else {
            language_data = code
        }
    })
    for (let i = 1; i < arguments.length; i++) {
        language_data = language_data.replaceAll(`%${i}`, arguments[i])
    }
    return language_data
}