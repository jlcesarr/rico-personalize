const BASE_URL = 'https://viacep.com.br'

const getAddress = async(cep) => {
    return new Promise((resolve, reject) => {
        fetch(`${BASE_URL}/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    })
}
export { getAddress }