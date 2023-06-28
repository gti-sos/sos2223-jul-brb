<svelte:head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = '/api/v2/tourism/';
    let dataTotal = "";
    let dataAlmeria = "";
    let employmentData = "";
    let establishmentsData = "";
    let occupancyData = "";

    let result = "";
    let resultStatus = "";

    onMount(async()=>{
        getData();
    });
    
    if (dev) API = 'http://localhost:12345'+API;

    async function getData(){
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

    async function loadChart(){
        let AlmeriaData = await getStatsAlmeria();
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
            "Dicimbre"
        ];

        const almeriaOrdenado = meses.map((month) => {
            const almeriaDato = AlmeriaData.find((item) => item.month === month);
            const nuevoItem = {
            month: month,
            employment : almeriaDato? almeriaDato.employment:0,
            establishments : almeriaDato ? almeriaDato.estimated_establishments:0,
            occupancy: almeriaDato? almeriaDato.Occupancy_rate_per_place:0
            }
            return nuevoItem;
        });

        console.log(AlmeriaData);
        new Morris.Bar({
        element: 'myfirstchart',
        data: almeriaOrdenado,
        xkey: "month",
        ykeys: ["employment","establishments","occupancy"],
        labels: ["Empleo", "Establecimientos estimados", "Grado de Ocupación"],
        barColors: ["Yellow", "Blue", "Green"],
        resize:true
        });
    }
  
</script>
<h1>Gráfico</h1>
<main>
    <div id="myfirstchart" style="height: 250px;">
    <p class="highcharts-description">
        La gráfica anterior muestra los datos de turismo rural de Almeria en 2022 de la tasa de empleo asociada al turismo,
        los establecimientos estimados abiertos y el grado de ocupacion por plaza.
    </p>
    </div>
</main>

<style>

</style>