function sendData(url, body, onload) {
    console.log(body)
    const xhr = new XMLHttpRequest()
    const method = body?"POST":"GET"
    xhr.open(method, url)
    xhr.onload = onload
    xhr.send(body)
}