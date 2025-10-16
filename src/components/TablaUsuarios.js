import React from "react";
import { View, Text, FlatList, StyleSheet, } from "react-native";
import BotonEliminarCliente from "../components/BotonEliminarCliente";

const TablaUsuarios = ({ usuarios, eliminarUsuario }) => {
  const renderItem = ({ item }) => (
    <View style={styles.fila}>
      <Text style={styles.celda}>{item.nombre}</Text>
      <Text style={styles.celda}>{item.correo}</Text>
      <Text style={styles.celda}>{item.telefono}</Text>
      <Text style={styles.celda}>{item.edad}</Text>
      <BotonEliminarCliente id={item.id} eliminarCliente={eliminarUsuario} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.celda}>Nombre</Text>
        <Text style={styles.celda}>Correo</Text>
        <Text style={styles.celda}>Teléfono</Text>
        <Text style={styles.celda}>Edad</Text>
        <Text style={styles.celda}>Acción</Text>
      </View>
      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  encabezado: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  fila: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  celda: { flex: 1, textAlign: "center" },
});

export default TablaUsuarios;