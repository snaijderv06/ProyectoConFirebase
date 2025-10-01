import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import FormularioClientes from "../components/FormularioClientes";
import TablaClientes from "../components/TablaClientes";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Clientes;