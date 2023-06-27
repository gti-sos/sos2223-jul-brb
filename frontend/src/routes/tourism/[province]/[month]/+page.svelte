<script lang="ts">

    // @ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { Button, Table, Alert, Icon } from 'sveltestrap';
    import { page } from '$app/stores';
    
    onMount(async () => {
      await getTourism();
    });

    let province = $page.params.province;
    let month = $page.params.month;
  
    let API = '/api/v2/tourism/'+province+'/'+month;
    
    if (dev) API = 'http://localhost:12345'+API;
    
    let updDatosProvince = province;
    let updDatosMonth = month;
    let updDatosEmploy = '';
    let updDatosEstablishments = '';
    let updDatosOcupancy= '';
  
  
    let result = "";
    let resultStatus = "";

    let message = "";
    let c = "";
  
    async function getTourism() {
      resultStatus = result = "";
      const res = await fetch("/api/v2/tourism?province="+province+"&month="+month, {
        method: 'GET'
      });
      try {
        const data = await res.json();
        result = JSON.stringify(data, null, 2);
        updDatosProvince = data.province;
        updDatosMonth = data.month;
        updDatosEmploy = data.traveler;
        updDatosEstablishments = data.estimated_establishments;
        updDatosOcupancy = data.Occupancy_rate_per_place;

      } catch (error) {
        console.log(`Error parsing result: ${error}`);
      }
      const status = await res.status;
      resultStatus = status;  
      if (status == 500) {
        message = "Error interno";
        c = "danger";
      } else if (status==404){
        message = "Dato no encontrado";
        c = "danger";
      } else if (status==502){
        message = "Dato no encontrado";
        c = "danger";
      }
    }
  
    async function updTourism() {
      resultStatus = result = "";
      const res = await fetch(API, {
        method: 'PUT',
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({
          province: updDatosProvince,
          month: updDatosMonth,
          employment: updDatosEmploy,
          estimated_establishments: updDatosEstablishments,
          Occupancy_rate_per_place: updDatosOcupancy
        })
      });    
      
      const status = await res.status;
      resultStatus = status;
      if (status == 200) {
        message = "Actualizado con exito";
        c = "success";
        getTourism();
        window.location.href = "/tourism";
      }else if (status == 400) {
        message = "Rellena todos los campos";
        c = "warning";
      } else if (status == 500) {
        message = "Error interno";
        c = "danger";
      } 
    }

   

  </script>
<h1>tourism-stats</h1>
  
  {#if message != ""}
  <Alert color={c}>{message}</Alert>
  {/if}
  
  <Table>
    <thead>
      <tr>
        <th>Provincia</th>
        <th>Mes</th>
        <th>Empleo</th>
        <th>Establicimientos</th>
        <th>Grado de ocupación</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{updDatosProvince}</td>
        <td>{updDatosMonth}</td>
        <td><input bind:value={updDatosEmploy}></td>
        <td><input bind:value={updDatosEstablishments}></td>
        <td><input bind:value={updDatosOcupancy}></td>
        <td>
          <Button on:click={updTourism}>Actualizar</Button>
        </td>
      </tr>
    </tbody>
  </Table>
