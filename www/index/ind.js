function sendPost() {
    let text = document.getElementById('test_field1');
    const body = {
        textBody:text
    }
    sendData("/", '{"textBody":"hello"}', () => {console.log("hello")})
}

function sendGet() {

}
