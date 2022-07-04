import axios from 'axios'

export async function getDirsTest() {
    axios
        .get("/api")
        .then((response) => {
            // handle success
            dir = document.getElementById("directory");
            dir.innerText = response.data.dir;
            console.log(response.data.json());
        })
        .catch((error) => {
            console.error(error);
        });
}
