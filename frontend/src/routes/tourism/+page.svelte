<script lang="ts">
    //@ts-nocheck
  
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import {  Table, Alert , Icon, ButtonToolbar, Button  } from 'sveltestrap';
    
    
    onMount(async () => {
      await getOccupationStats();
    });
  
    let API = '/api/v2/tourism';
    
    if (dev) API = 'http://localhost:12345'+API;
    

    let datos= [];
    let result = "";
    let resultStatus = "";
    
    let message = "";
    let c = "";
  
    let limit =10;
    let offset=0;
    let currentPage = 0;
    let totalPages = 1;
    
  
    async function getOccupationStats() {
      resultStatus = result = "";
      const res = await fetch(API+`?offset=${offset}&limit=${limit}`, {
        method: 'GET'
      });
      try {
        const data = await res.json();
        result = JSON.stringify(data, null, 2);
        datos= data;
      } catch (error) {
        console.log(`Error parsing result: ${error}`);
      }
      const status = await res.status;
      resultStatus = status;  
    }

    async function getInitialData(){
      resultStatus = result = "";
      const res = await fetch(API+`/loadInitialData`, {
        method: 'GET'
      });
      try {
        const data = await res.json();
        result = JSON.stringify(data, null, 2);
        datos= data;
      } catch (error) {
        console.log(`Error parsing result: ${error}`);
      }
      const status = await res.status;
      resultStatus = status;
      if (status==200) {
      getOccupationStats();
      message="Datos cargados correctamente"
      c="success";
     }else if(status==409){
      message="Los datos ya están cargados"
      c="warning";
     }else if(status==500){
      message="Error interno"
      c="danger";
     }
    }


  
    
  </script>
  
  <h1>Occupation-stats</h1>
  
  {#if message != ""}
    <Alert color={c}>{message}</Alert>
  {/if}
  
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet">
  <div class="table-container">
  <Table striped>
    <thead>
      <tr>
        <th>Province</th>
        <th>Month</th>
        <th>employment</th>
        <th>estimated_establishments</th>
        <th>Occupancy_rate_per_place</th>
        <td>
          <Button color="primary" outline size="sm" on:click={() => getInitialData()}>
            <Icon name="arrow-counterclockwise" class="icon" />
          </Button>
        </td>
      </tr>
    </thead>
    <tbody>
        {#each datos as dato}
        <tr>
          <td><a href="/tourism/{dato.province}/{dato.month}">{dato.province}</a></td>
          <td>{dato.month}</td>
          <td>{dato.employment}</td>
          <td>{dato.estimated_establishments}</td>
          <td>{dato.Occupancy_rate_per_place}</td>
        </tr>
        {/each}
    </tbody>
  </Table>
  </div>
  <ButtonToolbar>
    <Button color="primary" on:click={() => getInitialData()}>Load Data</Button>
  </ButtonToolbar>
  <div class="espacio"></div>
  
  