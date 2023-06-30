<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import {  Table  } from 'sveltestrap';

    onMount(async () => {
      await getEvents();
    });

    const url =
        "https://historical-events-by-api-ninjas.p.rapidapi.com/v1/historicalevents?text=spain";
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "db7a81dd23msh37f09d3fd011f71p1a51bdjsneb1b1142e170",
            "X-RapidAPI-Host": "historical-events-by-api-ninjas.p.rapidapi.com",
        },
    };

    
    let dataFinal = [];

    async function getEvents() {
        const response = await fetch(url, options);
        try {            
            const result = await response.json();
            console.log(result[0].year);
            result.sort(function(a,b){
                return a.year - b.year;
            })
            dataFinal = result;
            
        } catch (error) {
            console.error(error);
        }
    }
</script>

<h1>Eventos Históricos de España</h1>

<div class="table-container">
    <Table striped>
      <thead>
        <tr>
          <th>fecha</th>
          <th>evento</th>
        </tr>
      </thead>
      <tbody>
          {#each dataFinal as dato}
          <tr>
            <td>{dato.day + "/" + dato.month + "/" +dato.year}</td>
            <td>{dato.event}<td>
          </tr>
          {/each}
      </tbody>
    </Table>
    </div>
    
