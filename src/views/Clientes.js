import React, { useEffect, useState } from "react";
// Importar Button de 'react-native'
import { View, StyleSheet, Button } from "react-native"; 
import { db } from "../database/firebaseconfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// Importar useNavigation
import { useNavigation } from '@react-navigation/native'; 
import FormularioClientes from "../components/FormularioClientes";
import TablaClientes from "../components/TablaClientes";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  // Inicializar useNavigation
  const navigation = useNavigation(); 

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      cargarDatos(); // Recarga la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FormularioClientes cargarDatos={cargarDatos} />
      <TablaClientes clientes={clientes} eliminarCliente={eliminarCliente} />
      
      {/* Nuevo Botón para navegar a la vista 'Promedio' */}
      <Button
        title="Ir a Promedios"
        // Asegúrate de que 'Promedio' es el nombre de la ruta en tu navegador de pilas
        onPress={() => navigation.navigate('Promedio')} 
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Clientes;