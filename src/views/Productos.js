import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import ListaProductos from "../components/ListaProductos";
import FormularioProductos from "../components/FormularioProductos";
import TablaProductos from "../components/TablaProductos.js";
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const navigation = useNavigation(); // Hook para navegación

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos(); // Recarga la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FormularioProductos cargarDatos={cargarDatos} />
      <ListaProductos productos={productos} />
      <TablaProductos productos={productos} eliminarProducto={eliminarProducto} />
      <Button
        title="Ir a Clientes"
        onPress={() => navigation.navigate('Clientes')} // Navega a la vista Clientes
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Productos;