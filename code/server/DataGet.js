console.log("script carregado");

export async function GetData() {
    try {
        const result = await fetch("http://localhost:3000/api/dataeventos");
        const data = await result.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

export function ContarIngressos(data) {
    let ingressos = 0;
    for (let i = 0; i < data.length; i++) {
        ingressos += data[i].qtd_ingressoes;
    }
    return ingressos;
}

export function ContarValor(data) {
    let valor = 0;

    for (let i = 0; i < data.length; i++) {
        const preco = parseFloat(data[i].preco);
        const ingressos = data[i].qtd_ingressoes;
        valor += preco * ingressos;
    }

    return valor;
}


export async function main() {
    const data = await GetData();
    console.log("Dados:", data);
    const totalIngressos = ContarIngressos(data);
    console.log("Total de ingressos:", totalIngressos);
    const totalValor = ContarValor(data);
    console.log("Total de valor:", "R$" +totalValor + ",00");
}

main(); 
