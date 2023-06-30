<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let applStats = [];
    let API = "/api/v2/tourism/";
    let dataAlmeria = "";
    let result = "";
    let resultStatus = "";
    let employmentArray = [];
    var i;
    let dataTotal = "";

    onMount(async () => {
        getData();
    });

    if (dev) API = "http://localhost:12345" + API;

    async function getData() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            dataTotal = data;
            loadChart(dataTotal);
            console.log(dataTotal);
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }

    async function getAppl() {
        const url =
            "https://apistocks.p.rapidapi.com/monthly?symbol=AAPL&dateStart=2021-01-01&dateEnd=2021-12-31";
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Key":
                    "db7a81dd23msh37f09d3fd011f71p1a51bdjsneb1b1142e170",
                "X-RapidAPI-Host": "apistocks.p.rapidapi.com",
            },
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const resultado = data.Results;
            const resultadoArray = Object.values(resultado);
            console.log(resultadoArray);
            resultadoArray.forEach(manzana => {
                applStats.push(manzana.High);
            });
            return applStats;
        } catch (error) {
            console.error(error);
        }
    }

    async function getStatsAlmeria() {
        resultStatus = result = "";
        const res = await fetch(API + "?province=Almeria", {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            dataAlmeria = data;
            return dataAlmeria;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }
    async function loadChart() {
        let AlmeriaData = await getStatsAlmeria();
        let aplDato = await getAppl();
        const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Ocutbre",
            "Noviembre",
            "Dicimbre",
        ];

        const almeriaOrdenado = meses.map((month) => {
            const almeriaDato = AlmeriaData.find(
                (item) => item.month === month
            );
            const nuevoItem = {
                month: month,
                employment: almeriaDato ? almeriaDato.employment : 0,
            };
            return nuevoItem;
        });
        for(i=0;i<almeriaOrdenado.length;i++){
        let employmentOrdenado = almeriaOrdenado[i].employment;
        employmentArray.push(employmentOrdenado);
        }
        
        Highcharts.chart('container', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Empleo en el turismo de Almeria y apple en bolsa',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.yr.no/nb/historikk/graf/5-97251/Norge/Troms%20og%20Finnmark/Karasjok/Karasjok?q=2021"' +
            'target="_blank">YR</a>',
        align: 'left'
    },
    xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        floor: 0,
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'viajeros',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'picos de apple en bolsa',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 60,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Empleo',
        type: 'column',
        yAxis: 1,
        data: employmentArray,

    }, {
        name: 'Picos de apple en bolsa',
        type: 'spline',
        data: aplDato,
        tooltip: {
            valueSuffix: '$'
        }
    }]
});




        
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p>La siguiente gráfica muestra los valores de los picos en apple en bolsa y los trabajdores en Almeria relacionados con el turismo rural</p>
    </figure>
</main>
