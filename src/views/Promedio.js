import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native"; 
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';
import TituloPromedio from '../components/TituloPromedio';
import FormularioPromedios from "../components/FormularioPromedios";
import TablaPromedios from "../components/TablaPromedios"; 

const Promedio = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [promedio, setPromedio] = useState(null); 
  const COLLECTION_NAME = "edades";
  const API_URL = "https://2b8r5n9rz4.execute-api.us-east-2.amazonaws.com//calcular-promedio"; // <--- PERSONALIZA ESTA URL

  const navigation = useNavigation();

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const listaUsuarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setUsuarios([]);
    }
  };

  const calcularPromedioAPI = async (lista) => {
    if (!lista.length) {
      setPromedio(null);
      return;
    }
    try {
      const edades = lista.map(u => ({ edad: Number(u.edad) })).filter(e => !isNaN(e.edad) && e.edad !== null);
      if (edades.length === 0) {
        setPromedio(null);
        return;
      }
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edades }),
      });
      const data = await response.json();
      console.log("Respuesta de la API:", data);
      if (data.promedio && typeof data.promedio === 'number' && !isNaN(data.promedio)) {
        setPromedio(data.promedio);
      } else {
        console.warn("La API no devolvió un promedio válido:", data);
        setPromedio(null);
      }
    } catch (error) {
      console.error("Error al calcular promedio:", error);
      setPromedio(null);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  useEffect(() => { cargarDatos(); }, []);
  useEffect(() => {
    if (usuarios.length > 0) {
      calcularPromedioAPI(usuarios);
    } else {
      setPromedio(null);
    }
  }, [usuarios]);

  return (
    <View style={styles.container}>
      <TituloPromedio promedio={promedio} /> 
      <FormularioPromedios cargarDatos={cargarDatos} />
      <View style={styles.separator} /> 
      <TablaPromedios 
        datos={usuarios}
        eliminarUsuario={eliminarUsuario}
      />
      <Button
        title="Ir a Usuarios"
        onPress={() => navigation.navigate('Usuarios')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  separator: { height: 10 },
});

export default Promedio;