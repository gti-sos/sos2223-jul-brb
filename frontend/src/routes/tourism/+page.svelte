<script lang="ts">
    //@ts-nocheck
  
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import {  Table, Alert , Icon, ButtonToolbar, Button  } from 'sveltestrap';
    
    
    onMount(async () => {
      await getTourism();
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

    let b_mes = "";
    let b_provincia = "";
    let b_employment = "";
    let b_establishments = "";
    let b_occupancy = "";

    let new_mes = "";
    let new_provincia = "";
    let new_employment = "";
    let new_establishments = "";
    let new_occupancy = "";

    
  
    async function getTourism() {
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
      getTourism();
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

    let bus = [];
    async function busquedas(b_provincia, b_mes, b_employment, b_establishments, b_occupancy) {
      resultStatus = result = "";
      const params = { province: b_provincia, month: b_mes, employment: b_employment, establishments: b_establishments, occupancy: b_occupancy};
      const validParams = Object.fromEntries(Object.entries(params).filter(value => value !== ""));
      const query = new URLSearchParams(validParams).toString();
      const res = await fetch(API+`?${query}`, {
      method: "GET"
    });
    
    try {
      const data = await res.json();
      result = JSON.stringify(data, null, 2);
      let data1 = Object.values(data);

      if (data1.length === 5) {
        const parsedData = [{
          province: data1[0],
          month: data1[1],
          employment: parseFloat(data1[2]),
          establishments: parseFloat(data1[3]),
          occupancy: parseFloat(data1[4])
        }];
        bus = parsedData;
      }else{
        bus = data1;
      }
    } catch (error) {
      console.log(`Error parsing result: ${error}`);
    }
    const status = await res.status;
    resultStatus = status;
    if (status == 200) {

      message = "Elemento encontrado";
      c = "success";
    } else if (status == 404) {
      message = "Elemento no encontrado";
      c = "danger";
    }else if (status == 500) {
      message = "Error interno";
      c = "danger";
    }
  }

  async function createTourism() {
    resultStatus = result = "";
    const res = await fetch(API, {
      method: 'POST',
      headers:{
        "Content-Type" : "application/json"
      },
      body:JSON.stringify({
        province: new_provincia,
        month: new_mes,
        employment: new_employment,
        estimated_establishments: new_establishments,
        Occupancy_rate_per_place: new_occupancy 
      })
    });    
    
    const status = await res.status;
    resultStatus = status;
    if (status==201) {
      getTourism();
      message="elemento creado"
      c="success";
    }else if(status==409){
      message="Conflicto, el elemento ya existe"
      c="warning";
    }else if(status==400){
      message="Rellena todos los campos"
      c="warning";
    }else if(status == 500){
      message="Internal Error"
      c="danger";
    }
  }

  async function deleteStat(province,month) {
    resultStatus = result = "";
    const res = await fetch(API+"/"+province+"/"+month, {
      method: 'DELETE'
    });    
    
    const status = await res.status;
    resultStatus = status;
    if(status==200){
      getTourism();
      message = "Elemento borrado";
      c = "success";
    } 
  }

  async function deleteAll() {
    resultStatus = result = "";
    const res = await fetch(API, {
      method: 'DELETE'
    });    
    
    const status = await res.status;
    resultStatus = status;
    if (status==200) {
      location.reload();
      window.alert("ESTAS SEGURO?");
    }
  }
    async function previousPage() {
        offset -= limit;
        if(offset<0){
            offset += limit;
        }
        else {
          currentPage--;
          await getTourism();
        }
    }
    async function nextPage() {
        offset += limit;
        if(offset>=12){
            offset -= limit;
        }
        else{
          currentPage++;
          await getTourism();            
        }        
    }


  
    
  </script>
  
  <h1>tourism-stats</h1>
  
  {#if message != ""}
    <Alert color={c}>{message}</Alert>
  {/if}
  
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet">
  <div class="table-container">
  <Table striped>
    <thead>
       <tr>
        <td><input bind:value={b_provincia} placeholder="Introduce provincia"></td>
        <td><input bind:value={b_mes} placeholder="Introduce mes"></td>
        <td><input bind:value={b_employment} placeholder="Introduce nº de empleados"></td>
        <td><input bind:value={b_establishments} placeholder="Introduce nº de establecimientos"></td>
        <td><input bind:value={b_occupancy} placeholder="Introduce grado de ocupacion"></td>
        <Button color="primary" outline size="sm" on:click={() => busquedas(b_provincia, b_mes, b_employment, b_establishments, b_occupancy)}>
          <Icon name="search" class="icon"/>
        </Button>
      </tr>
      <tr>
        <th>Provincia</th>
        <th>Mes</th>
        <th>Empleo</th>
        <th>Establicimientos Estimados</th>
        <th>Grado de ocupación por plaza</th>
      </tr>
    </thead>
    <tbody>
        {#each bus as dato}
          <tr>
            <td><a href="/tourism/{dato.province}/{dato.month}">{dato.province}</a></td>
            <td>{dato.month}</td>
            <td>{dato.employment}</td>
            <td>{dato.estimated_establishments}</td>
            <td>{dato.Occupancy_rate_per_place}</td>
          </tr>
        {/each}
        <tr>
        <td><input bind:value={new_provincia} placeholder="Introduce provincia"></td>
        <td><input bind:value={new_mes} placeholder="Introduce mes"></td>
        <td><input bind:value={new_employment} placeholder="Introduce nº de empleados"></td>
        <td><input bind:value={new_establishments} placeholder="Introduce nº de establecimientos"></td>
        <td><input bind:value={new_occupancy} placeholder="Introduce grado de ocupacion"></td>

        <td>
          <Button color="success" outline size="sm" on:click={createTourism}>
            <Icon name="plus" class="icon"/>
          </Button>
        </td>
        </tr>
        {#each datos as dato}
        <tr>
          <td><a href="/tourism/{dato.province}/{dato.month}">{dato.province}</a></td>
          <td>{dato.month}</td>
          <td>{dato.employment}</td>
          <td>{dato.estimated_establishments}</td>
          <td>{dato.Occupancy_rate_per_place}</td>
          <td>
            <Button color="danger" outline size="sm" on:click={() => deleteStat(dato.province,dato.month)}>
              <Icon name="x" class="icon" />
            </Button>
          </td>
        </tr>
        {/each}
    </tbody>
  </Table>
  </div>
  <ButtonToolbar>
    <Button color="primary" on:click={() => getInitialData()}>Load Data</Button>
    <Button color="danger" on:click={() => deleteAll()}>Delete All Data</Button>
  </ButtonToolbar>

  <div id="buttons" style="text-align:center;">
    {#if currentPage > 0}
      <Button color="primary" outline size="sm" on:click={previousPage}><Icon name="arrow-bar-left" class="icon" /></Button>
    {/if}
    {#if currentPage<totalPages }
      <Button color="primary" outline size="sm" on:click={nextPage}><Icon name="arrow-bar-right" class="icon" /></Button>
    {/if}
  </div>
  
  