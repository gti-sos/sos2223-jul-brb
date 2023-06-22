import express from "express";
import Datastore from "nedb";
var app = express();
var db = new Datastore(); 

var arrayBRB = [
    {
        province: "Almeria",
        month: "Enero",
        employment: 156.144067797,
        estimated_establishments: 114.519524618,
        Occupancy_rate_per_place:11.471598948861700
    },
    {
        province: "Almeria",
        month: "Febrero",
        employment: 165.935622318,
        estimated_establishments: 123.232780612,
        Occupancy_rate_per_place:15.870340999212300
    },
    {
        province: "Almeria",
        month: "Marzo",
        employment: 178.48,
        estimated_establishments: 128.432844575,
        Occupancy_rate_per_place:25.72501564782260
    }, {
        province: "Almeria",
        month: "Abril",
        employment: 194.213973799,
        estimated_establishments: 143.247619048,
        Occupancy_rate_per_place:33.23087731624470
    }, {
        province: "Almeria",
        month: "Mayo",
        employment: 211.12694877500000,
        estimated_establishments: 149.41231671,
        Occupancy_rate_per_place:16.212658227842300
    }, {
        province: "Almeria",
        month: "Junio",
        employment: 205.303643725,
        estimated_establishments: 142.650819672,
        Occupancy_rate_per_place:11.585300140105000
    }, {
        province: "Almeria",
        month: "Julio",
        employment: 216.24,
        estimated_establishments: 147.122807018,
        Occupancy_rate_per_place:10.411951109101900
    }, {
        province: "Almeria",
        month: "Agosto",
        employment: 225.728155339,
        estimated_establishments: 156.541330645,
        Occupancy_rate_per_place:11.757316919984400
    }, {
        province: "Almeria",
        month: "Septiembre",
        employment: 215.42028985500000,
        estimated_establishments: 146,
        Occupancy_rate_per_place:18.64008065419370
    }, {
        province: "Almeria",
        month: "Ocutbre",
        employment: 204.452025587,
        estimated_establishments: 139.196378042,
        Occupancy_rate_per_place:20.67344739839550
    }, {
        province: "Sevilla",
        month: "Noviembre",
        employment: 176.955223881,
        estimated_establishments: 126.476608187,
        Occupancy_rate_per_place:8.755560377562390
    }, {
        province: "Almeria",
        month: "Dicimbre",
        employment: 170.085158151,
        estimated_establishments: 122.784313725,
        Occupancy_rate_per_place:19.210915846677700
    },
];

db.insert(arrayBRB);
app.use(express.json());


const BASE_API_URL = "/api/v1";
const BRB_URL = BASE_API_URL + "/tourism";

function loadBackendBRBv1(app) {
    //-----------------------------------------gets-------------------------------------------------------------
    app.get(BRB_URL+"/docs",(req,res)=>{
        res.redirect("https://documenter.getpostman.com/view/25989970/2s93RNyEu7");
    })


    app.get(BRB_URL + '', (request, response) => {
        const query = request.query;

        if (Object.keys(query).length === 0) {
            // Obtener todos los datos
            console.log("New request to /tourism");
            db.find({}, (err, arrayDatos) => {
                if (err) {
                    console.log(`Error getting /tourism: ${err}`);
                    response.status(500).send({ error: "Error interno del servidor" });
                } else {
                    console.log(`Returned ${arrayDatos.length}`);
                    const datosSinId = arrayDatos.map((n) => {
                        delete n._id;
                        return n;
                    });
                    response.status(200).json(datosSinId);
                }
            });
        } else if(request.query.offset || request.query.limit){
            const { offset, limit } = request.query;
            console.log(`New request to /tourism?offset="${offset}"&limit="${limit}"`);
            if (!offset || !limit) {
                return response.status(400).send('faltan parametros requestueridos');
            } else {
                const startIndex = parseInt(offset);
                const endIndex = parseInt(offset) + parseInt(limit);

                db.find({}, (err, docs) => {
                    if (err) {
                        response.status(500).send('Error retrieving data from database');
                    } else if(offset < 0 || offset > limit || offset > docs.length || limit < 0 || limit > docs.length){
                        response.status(400).send('Bad request');
                    } else {
                        const data = docs.slice(startIndex,endIndex);
                        data.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(data.length == 1){
                            response.send(data[0]);
                        }else{
                            response.send(data);    
                        }  
                    }
                });
            }
        } else {
            // Obtener datos filtrados
            const province = query.province;
            const month = query.month;
            const campo = query.campo;
            const employment = parseFloat(query.employment);
            const estimated_establishments = parseFloat(query.estimated_establishments);
            const Occupancy_rate_per_place = parseFloat(query.Occupancy_rate_per_place);

            if (province && month) {
                console.log(`New request to /tourism?province="${province}"&month="${month}"`);
                db.findOne({ province: province, month: month },{_id: 0}, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(
                            `No se encontraron datos con el campo "${province}" igual a "${month}"`
                        );
                        console.log(404);
                    } else {
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        }
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (province) {
                console.log(`New request to /tourism?province="${province}"`);
                db.find({ province: province }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo province igual a "${province}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        } 
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (month) {
                console.log(`New request to /tourism?month="${month}"`);
                db.find({ month: month }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo month igual a "${month}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        }); 
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        } 
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (campo){
                console.log(`New request to /tourism?campo="${campo}"`);
                db.find({ [campo]: { $exists: true } }, { [campo]: 1, _id: 0 }, (err, docs) => {
                    if (err) {
                        response.status(500).send('Error interno del servidor');
                        console.log(err);
                    } else {
                        if (docs.length === 0) {
                            response.status(404).send(`No se encontraron datos con el campo "${campo}"`);
                        } else {
                            const lc = docs.map((doc) => doc[campo]);
                            lc.map((n) => {
                                delete n._id;
                                return n;
                            });
                            if(lc.length == 1){
                                response.send(lc[0]);
                            }else{
                                response.send(lc);    
                            }
                            console.log(`Returned ${lc.length}`);
                        }
                    }
                });
            } else if (employment) {
                console.log(`New request to /tourism?employment="${employment}"`);
                db.find({ employment: employment }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo employment igual a "${employment}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        } 
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (estimated_establishments) {
                console.log(`New request to /tourism?estimated_establishments="${estimated_establishments}"`);
                db.find({ estimated_establishments: estimated_establishments }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo estimated_establishments igual a "${estimated_establishments}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        }
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (Occupancy_rate_per_place) {
                console.log(`New request to /tourism?Occupancy_rate_per_place="${Occupancy_rate_per_place}"`);
                db.find({ Occupancy_rate_per_place: Occupancy_rate_per_place}, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo Occupancy_rate_per_place igual a "${Occupancy_rate_per_place}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        }
                        console.log(`Returned ${array.length}`);
                    }
                });
            }
        }
    });

    
    app.get(BRB_URL + "/loadInitialData", (request, response) => {
        db.find({}, (err, dato) => {
            if (err) {
                console.log(`error geting /tourism: ${err}`);
                response.sendStatus(500);
            } else if (dato.length === 0) {
                for (var i = 0; i < arrayBRB.length; i++) {
                    db.insert(arrayBRB[i]);
                }
                response.sendStatus(201);
                console.log("se han cargado los datos iniciales");
            } else {
                response.status(409).send("ya existen los datos");
                console.log(`existen ${dato.length} datos`);
            }
        }
        );
    });

    app.get(BRB_URL+"/:province", (request, response) => {
        var provincia = request.params.province
        console.log(`nuevo get a ${provincia}`);
        db.find({province: provincia}, (err, dato) => {
            if (err) {
                console.log(`error geting /tourism: ${err}`);
                response.sendStatus(500);
            }else if (dato.length === 0) {
                console.log(`error geting /tourism: element not found`);
                response.sendStatus(404);
            } else {
                response.status(200).json(dato.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
        });
    });

    app.get(BRB_URL+"/:province/:month", (request, response) => {
        var provincia = request.params.province;
        var mes = request.params.month;
        console.log(`nuevo get a ${provincia} ${mes}`);
        db.find({ province: provincia, month: mes }, (err, dato) => {
            if (err) {
                console.log(`error geting /tourism: ${err}`);
                response.sendStatus(500);
            }else if (dato.length === 0) {
                console.log(`error geting /tourism: element not found`);
                response.sendStatus(404);
            } else {
                delete dato[0]._id;
                response.status(200).send(JSON.stringify(dato[0], null, 2));;
            }
        });
    });


    //-------------------------------------POSTS----------------------------------------------------------
    const camposObligatoriosBRB = ["province", "month", "employment", "estimated_establishments", "Occupancy_rate_per_place"];
    app.post(BRB_URL, (request, response) => {
        var nuevo = request.body;
        db.find({ province: nuevo.province, month: nuevo.month }, (err, dato) => {
            if (err) {
                console.log(`error posting /tourism: ${err}`);
                response.sendStatus(500);
            } else if (dato.length > 0) {
                response.status(409).send('CONFLICT, el objeto ya existe en la base de datos');
                console.log('409');
            } else if (camposObligatoriosBRB.find((n) => !nuevo[n])) {
                response.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
                console.log('400');
            } else {
                db.insert(nuevo);
                console.log('New POST to /tourism');
                response.status(201).send("created");
            }
        });
    });

    app.post(BRB_URL + "/:campo", (req, res) => {
        res.status(405).send('Method not Allowed');
        console.log(`Error 405 Method not Allowed`);
    });

    //----------------------------------------------------------PUTS----------------------------------------
    app.put(BRB_URL, (req, res) => {
        res.status(405).send('Method not Allowed');
        console.log(`Error 405 Method not Allowed`);
    });

    app.put(BRB_URL + "/:province/:month", (req, res) => {
        var provincia = req.params.province;
        var mes = req.params.month;
        var nuevo = req.body;
        console.log(nuevo);
        db.find({ province: provincia, month: mes }, (err, dato) => {
            if (err) {
                console.log(`error posting /tourism: ${err}`);
                res.sendStatus(500);
            } else if (dato.length === 0) {
                console.log(dato);
                res.status(404).send(`No se encontraron datos con el campo ${provincia}`);
            } else if (camposObligatoriosBRB.find((n) => !nuevo[n])) {
                console.log('400');
                res.status(400).send('BAD REQUEST, campos incorrectos en el objeto');
            }/*else if(provincia !== nuevo.province && mes !== nuevo.mes){
                res.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
                console.log('400');
            }*/else {
                db.update({ province: provincia, month: mes }, nuevo, err => {
                    if (err) {
                        console.log(`error posting /tourism: ${err}`);
                        res.status(500).send("Inernal error");
                    } else {
                        console.log(`New PUT to /${provincia}/${mes}`);
                        res.status(200).send('ok');
                    }
                });
            }
        });
    });

    app.delete(BRB_URL, (request, response)=>{
        db.remove({},{multi:true},(err,numRemoved)=>{
            if(err){
                console.log(`Error deleting: ${err}`);
                response.sendStatus(500);
            }else{
                if(numRemoved==0){
                    response.sendStatus(404).send("HTTP 404 NOT FOUND");
                }else{
                    console.log(`Files removed ${numRemoved}`);
                    response.sendStatus(200);
                }    
            }
        });
    });

    app.delete(BRB_URL+"/:province/:month", (req,res) => {
        var provincia = req.params.province;
        var month = req.params.month;

        console.log(`New DELETE to /provincia/${provincia} ${month} `);

        db.remove({province: provincia, month: month}, {multi:true}, (err,numRemoved)=>{
            if(err){
                console.log(`Error deleting /${provincia}: ${err}`);
                res.status(500).send("Internal server error");
            }else{
                if (numRemoved==0){
                    res.status(404).send("not found");
                }else{
                    console.log(`Self-employed removed: ${numRemoved}`);
                    res.status(200).send("ok");
                }
            }
        });
    });

    app.delete(BRB_URL+"/:province", (req,res) => {
        var provincia = req.params.province;
       
        console.log(`New DELETE to /provincia/${provincia} `);

        db.remove({province: provincia}, {multi:true}, (err,numRemoved)=>{
            if(err){
                console.log(`Error deleting /${provincia}: ${err}`);
                res.status(500).send("Internal server error");
            }else{
                if (numRemoved==0){
                    res.status(404).send("not found");
                }else{
                    console.log(`Self-employed removed: ${numRemoved}`);
                    res.status(200).send("ok");
                }
            }
        });
    });

};

export {loadBackendBRBv1}