const moneda = document.getElementById('moneda');
const lista = document.getElementById('lista');
const buscar = document.getElementById('buscar');
const resultado = document.getElementById('resultado');
const grafico = document.getElementById('grafico');


const getAllIndicators = async () => {
    try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching indicators:', error);
        return null;
    }
};


const getLastTenByIndicator = async (indicatorType) => {
    try {
        const response = await fetch(`https://mindicador.cl/api/${indicatorType}`);
        const data = await response.json();
        return data.serie.slice(0, 10);
    } catch (error) {
        console.error('Error fetching last resultados:', error);
        return null;
    }
};

const loadCurrencyTypes = async () => {
    const indicators = await getAllIndicators();
    if (indicators) {
        Object.keys(indicators)
            .slice(3)
            .forEach((indicator) => {
                lista.innerHTML += `<option value="${indicator}">${indicator}</option>`;
            });
    }
};

const getCurrencyValue = async (currencyType) => {
    const data = await getAllIndicators();
    if (data) {
        return data[currencyType].valor;
    } else {
        return null;
    }
};

const rendergrafico = async () => {
    const indicatorData = await getLastTenByIndicator(lista.value);
    if (indicatorData) {
        const chartType = 'bar'; 
        const title = `Chart ${lista.value.toUpperCase()}`;
        const dates = indicatorData.map((currency) => currency.fecha.slice(0, 10));
        const values = indicatorData.map((currency) => currency.valor);

        const config = {
            type: chartType,
            data: {
                labels: dates,
                datasets: [
                    {
                        label: title,
                        backgroundColor: 'rgba(214, 40, 40, 0.5)',
                        data: values,
                    },
                ],
            },
        };

        new Chart(grafico, config);
    }
};

moneda.addEventListener('click', () => {
    moneda.classList.remove('is-invalid');
});

buscar.addEventListener('click', async () => {
    if (moneda.value !== '' && moneda.value > 0) {
        const currencyValue = await getCurrencyValue(lista.value);
        if (currencyValue) {
            const conversionresultado = moneda.value / currencyValue;
            resultado.textContent = `resultado: $${conversionresultado.toFixed(2)}`;
            await rendergrafico();
        }
        moneda.value = '';
        moneda.focus();
    } else {
        moneda.classList.add('is-invalid');
        moneda.value = '';
    }
});

loadCurrencyTypes();