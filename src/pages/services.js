import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8000';

export class Produto {
    constructor(nome, descricao, valor, productId) {
        this.producId = productId;
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
    }
}

export async function getAllProducts(){
    const response = await axios.get(`${apiUrl}/products/`)
    return response.data
}

export async function getProductById(id){
    const response = await axios.get(`${apiUrl}/products/${id}/`)
    return response.data
}

export async function deleteProduct(id){
    const response = await axios.delete(`${apiUrl}/products/${id}/`)
    window.location.reload();
    return response
}

export async function updateProduct(prd){
    const data = prd
    const id = prd.product_id
    const response = await axios.put(`${apiUrl}/products/${id}/`, data)
    window.location.reload();
    return response
}

export async function createProduct(prd){
    let data = prd
    data.valor = data.valor.replace("R$ ", "")
    data.valor = data.valor.replace(",", '.')
    data.valor = parseFloat(data.valor) * 100
    const response = await axios.post(`${apiUrl}/products/`, data)
    if (response.data.code === 'ERROR'){
        alert("Atenção o valor do produto deve ser maior que R$2,00")
        return
    }
    window.location.reload();
    return response.data
}
