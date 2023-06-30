<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { Table } from "sveltestrap";

    onMount(async () => {
        await getPlanets();
    });

    const url =
        "https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planets/";
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "db7a81dd23msh37f09d3fd011f71p1a51bdjsneb1b1142e170",
            "X-RapidAPI-Host": "planets-info-by-newbapi.p.rapidapi.com",
        },
    };

    let dataFinal = [];

    async function getPlanets() {
        const response = await fetch(url, options);
        try {
            const result = await response.json();
            console.log(result);
            dataFinal = result;
        } catch (error) {
            console.error(error);
        }
    }
</script>

<h1>Información de los Planetas del Sistema Solar</h1>

<div class="table-container">
    <Table striped>
        <thead>
            <tr>
                <th>planeta</th>
                <th>descripción</th>
            </tr>
        </thead>
        <tbody>
            {#each dataFinal as dato}
                <tr>
                    <td>{dato.name}</td>
                    <td>{dato.description}</td>
                </tr>
            {/each}
        </tbody>
    </Table>
</div>
