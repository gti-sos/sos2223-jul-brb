<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    

    let API = "/api/v2/tourism/";
    let API19 = "https://sos2223-jul-brb.appspot.com/apt-occ";
    let dataTotal = "";
    let dataAlmeria = "";
    let dataAlmeria19 = "";
    let employmentArray = [];
    let travelerArray = [];
    var i;

    let result = "";
    let resultStatus = "";

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

    async function getStatsAlmeria19() {
        resultStatus = result = "";
        const res = await fetch(API19 + "?province=Almeria", {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            dataAlmeria19 = data;
            return dataAlmeria19;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }

    async function loadChart() {
        let AlmeriaData = await getStatsAlmeria();
        let AlmeriaData19 = await getStatsAlmeria19();
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
            const almeriaDato19 = AlmeriaData19.find(
                (item) => item.month === month
            );
            const nuevoItem = {
                month: month,
                employment: almeriaDato ? almeriaDato.employment : 0,
                traveller: almeriaDato19 ? almeriaDato19.traveler : 0
            };
            return nuevoItem;
        });
        for(i=0;i<almeriaOrdenado.length;i++){
        let employmentOrdenado = almeriaOrdenado[i].employment;
        let travellerOrdenado = almeriaOrdenado[i].traveller
        employmentArray.push(employmentOrdenado);
        travelerArray.push(travellerOrdenado)
        }
        
        // Retrieved from https://www.ssb.no/jord-skog-jakt-og-fiskeri/jakt


Highcharts.chart('container', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Moose and deer hunting in Norway, 2000 - 2021',
        align: 'left'
    },
    
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        y: 70,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
     xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Quantity'
        }
    },
    plotOptions: {
       
        areaspline: {
            fillOpacity: 0.5
        }
    },
    series: [{
        name: 'Moose',
        data: employmentArray
           
    }, {
        name: 'Deer',
        data: travelerArray
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
<h1>Gráfico</h1>
<main>
    <figure class="highcharts-figure">
        <div id="container" />
    </figure>
</main>

<style>
</style>
